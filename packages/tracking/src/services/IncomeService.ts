import { PrismaClient } from "@prisma/client";
import {
  IncomeAnalyticsModel,
  IncomeCategoryBreakdownModel,
  IncomeModel,
  IncomeTopCategoryModel,
} from "@shared/models";
import { v4 } from "uuid";
import * as uuidBuffer from "uuid-buffer";
import { PresentationService } from "@tracking/utils/presentationService";
import { IAddIncomeParams, IUpdateIncomeParams } from "@shared/params";
import {
  IncomeCategoryId,
  IncomeId,
  UserId,
} from "@shared/primitives";
import { DatabaseError, NotFoundError } from "@tracking/errors";

class IncomeService {
  private prisma: PrismaClient;
  private presentationService: PresentationService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.presentationService = new PresentationService();
  }

  async addIncome(params: IAddIncomeParams): Promise<IncomeModel> {
    try {
      const { userId, description, date, amount, categoryId } = params;

      if (categoryId) {
        await this.assertCategoryExists(categoryId);
      }

      const newIncome = await this.prisma.income.create({
        data: {
          id: uuidBuffer.toBuffer(v4()),
          userId: userId,
          amount: amount,
          date: new Date(Number(date) * 1000),
          description: description,
          categoryId: categoryId ? uuidBuffer.toBuffer(categoryId) : undefined,
        },
        include: {
          category: true,
        },
      });
      return this.presentationService.toIncomeModel(newIncome);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error creating income");
    }
  }

  async getIncomeByUserIdAndMonth(
    userId: UserId,
    startDate: Date,
    endDate: Date,
  ): Promise<IncomeModel[]> {
    try {
      const incomes = await this.prisma.income.findMany({
        where: {
          userId: userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          created: "desc",
        },
        include: {
          category: true,
        },
      });

      return incomes.map((income) =>
        this.presentationService.toIncomeModel(income),
      );
    } catch (error) {
      throw new DatabaseError("Error in getting incomes");
    }
  }

  async updateIncome(params: IUpdateIncomeParams): Promise<IncomeModel> {
    try {
      const { id, amount, date, description, categoryId } = params;

      const existingIncome = await this.prisma.income.findUnique({
        where: {
          id: uuidBuffer.toBuffer(id),
        },
      });

      if (!existingIncome) {
        throw new NotFoundError("Income not found");
      }

      if (categoryId) {
        await this.assertCategoryExists(categoryId);
      }

      const updatedIncome = await this.prisma.income.update({
        where: {
          id: uuidBuffer.toBuffer(id),
        },
        data: {
          amount: amount,
          date: date ? new Date(Number(date) * 1000) : undefined,
          description: description,
          categoryId:
            categoryId !== undefined
              ? categoryId
                ? uuidBuffer.toBuffer(categoryId)
                : null
              : undefined,
        },
        include: {
          category: true,
        },
      });

      return this.presentationService.toIncomeModel(updatedIncome);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("error in updating the income");
    }
  }

  async deleteIncome(id: IncomeId): Promise<void> {
    try {
      await this.prisma.income.delete({
        where: {
          id: uuidBuffer.toBuffer(id),
        },
      });
    } catch (error) {
      throw new DatabaseError("error in deleting the income");
    }
  }

  async getIncomeAnalytics(
    userId: UserId,
    startDate: Date,
    endDate: Date,
  ): Promise<IncomeAnalyticsModel> {
    try {
      const incomes = await this.prisma.income.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          category: true,
        },
      });

      const totalIncome = incomes.reduce(
        (sum, income) => sum + income.amount,
        0,
      );

      const breakdownMap = new Map<
        string,
        {
          categoryId: IncomeCategoryId | null;
          categoryName: string | null;
          total: number;
        }
      >();

      incomes.forEach((income) => {
        const key = income.categoryId
          ? uuidBuffer.toString(income.categoryId)
          : "uncategorized";

        const existing = breakdownMap.get(key);
        const categoryIdValue = income.categoryId ? IncomeCategoryId(key) : null;
        const categoryNameValue = income.category?.name ?? "Uncategorized";

        if (existing) {
          existing.total += income.amount;
        } else {
          breakdownMap.set(key, {
            categoryId: categoryIdValue,
            categoryName: categoryNameValue,
            total: income.amount,
          });
        }
      });

      const categoryBreakdown = Array.from(breakdownMap.values())
        .map(
          (item) =>
            new IncomeCategoryBreakdownModel(
              item.categoryId,
              item.categoryName,
              Number(item.total.toFixed(2)),
              totalIncome
                ? Number(((item.total / totalIncome) * 100).toFixed(2))
                : 0,
            ),
        )
        .sort((a, b) => b.totalAmount - a.totalAmount);

      const topCategory =
        categoryBreakdown.length > 0
          ? new IncomeTopCategoryModel(
              categoryBreakdown[0].categoryId,
              categoryBreakdown[0].categoryName,
              categoryBreakdown[0].totalAmount,
            )
          : null;

      return new IncomeAnalyticsModel(
        Number(totalIncome.toFixed(2)),
        categoryBreakdown,
        topCategory,
      );
    } catch (error) {
      throw new DatabaseError("error generating income analytics");
    }
  }

  private async assertCategoryExists(categoryId: IncomeCategoryId): Promise<void> {
    const category = await this.prisma.incomeCategory.findUnique({
      where: {
        id: uuidBuffer.toBuffer(categoryId),
      },
    });

    if (!category) {
      throw new NotFoundError("Income Category not found");
    }
  }
}

export default IncomeService;
