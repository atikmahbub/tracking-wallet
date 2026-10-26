import { PrismaClient } from "@prisma/client";
import {
  ExpenseAnalyticsModel,
  ExpenseCategoryBreakdownModel,
  ExpenseModel,
  ExpenseTopCategoryModel,
} from "@shared/models";
import { v4 } from "uuid";
import * as uuidBuffer from "uuid-buffer";
import { isUniqueViolation } from "@tracking/utils/PrismaUtils";
import { PresentationService } from "@tracking/utils/presentationService";
import { IAddExpenseParams, IUpdateExpenseParams } from "@shared/params";
import {
  CategoryId,
  ExpenseId,
  makeUnixTimestampToISOString,
  UserId,
} from "@shared/primitives";
import { DatabaseError, NotFoundError } from "@tracking/errors";
import { recordTombstone } from "@tracking/utils/SyncUtils";

class ExpenseService {
  private prisma: PrismaClient;
  private presentationService: PresentationService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.presentationService = new PresentationService();
  }

  private async findOccurrence(
    params: IAddExpenseParams
  ): Promise<ExpenseModel | null> {
    if (!params.recurringRuleId || !params.occurrenceDate) {
      return null;
    }
    const row = await this.prisma.expense.findFirst({
      where: {
        userId: params.userId,
        recurringRuleId: uuidBuffer.toBuffer(params.recurringRuleId),
        occurrenceDate: new Date(Number(params.occurrenceDate) * 1000),
      },
      include: {
        category: true,
      },
    });
    return row ? this.presentationService.toExpenseModel(row) : null;
  }

  async addExpense(params: IAddExpenseParams): Promise<ExpenseModel> {
    try {
      const { userId, description, date, amount, categoryId } = params;

      // An occurrence a rule already produced (pushed by another device, or a
      // retried push) comes back as the existing row instead of a duplicate.
      const existing = await this.findOccurrence(params);
      if (existing) {
        return existing;
      }

      if (categoryId) {
        await this.assertCategoryExists(categoryId as CategoryId, userId as UserId);
      }

      const newExpense = await this.prisma.expense.create({
        data: {
          id: uuidBuffer.toBuffer(v4()),
          userId: userId,
          amount: amount,
          date: new Date(Number(date) * 1000),
          description: description,
          categoryId: categoryId ? uuidBuffer.toBuffer(categoryId) : undefined,
          recurringRuleId: params.recurringRuleId
            ? uuidBuffer.toBuffer(params.recurringRuleId)
            : null,
          occurrenceDate: params.occurrenceDate
            ? new Date(Number(params.occurrenceDate) * 1000)
            : null,
        },
        include: {
          category: true,
        },
      });
      return this.presentationService.toExpenseModel(newExpense);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      // Lost a race with a concurrent add of the same occurrence.
      if (isUniqueViolation(error)) {
        const existing = await this.findOccurrence(params);
        if (existing) {
          return existing;
        }
      }
      throw new DatabaseError("Error creating expense");
    }
  }

  async getExpenseByUserIdAndMonth(
    userId: UserId,
    startDate: Date,
    endDate: Date,
  ): Promise<ExpenseModel[]> {
    try {
      const expenses = await this.prisma.expense.findMany({
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

      return expenses.map((expense) =>
        this.presentationService.toExpenseModel(expense),
      );
    } catch (error) {
      throw new DatabaseError("Error in getting expenses");
    }
  }

  async updateExpense(params: IUpdateExpenseParams): Promise<ExpenseModel> {
    try {
      const { id, amount, date, description, categoryId } = params;

      const existingExpense = await this.prisma.expense.findUnique({
        where: {
          id: uuidBuffer.toBuffer(id),
        },
      });

      if (!existingExpense) {
        throw new NotFoundError("Expense not found");
      }

      if (categoryId) {
        await this.assertCategoryExists(categoryId as CategoryId, existingExpense.userId as UserId);
      }

      const updatedExpense = await this.prisma.expense.update({
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

      return this.presentationService.toExpenseModel(updatedExpense);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("error in updating the expense");
    }
  }

  async deleteExpense(id: ExpenseId): Promise<void> {
    try {
      const expenseId = uuidBuffer.toBuffer(id);
      const row = await this.prisma.expense.findUnique({ where: { id: expenseId } });
      if (!row) {
        throw new NotFoundError("Expense not found");
      }
      await this.prisma.$transaction([
        this.prisma.expense.delete({ where: { id: expenseId } }),
        recordTombstone(this.prisma, "expense", expenseId, row.userId),
      ]);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("error in deleting the expense");
    }
  }

  async getExpenseAnalytics(
    userId: UserId,
    startDate: Date,
    endDate: Date,
  ): Promise<ExpenseAnalyticsModel> {
    try {
      const expenses = await this.prisma.expense.findMany({
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

      const totalExpense = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0,
      );

      const breakdownMap = new Map<
        string,
        {
          categoryId: CategoryId | null;
          categoryName: string | null;
          total: number;
        }
      >();

      expenses.forEach((expense) => {
        const key = expense.categoryId
          ? uuidBuffer.toString(expense.categoryId)
          : "uncategorized";

        const existing = breakdownMap.get(key);
        const categoryIdValue = expense.categoryId ? CategoryId(key) : null;
        const categoryNameValue = expense.category?.name ?? "Uncategorized";

        if (existing) {
          existing.total += expense.amount;
        } else {
          breakdownMap.set(key, {
            categoryId: categoryIdValue,
            categoryName: categoryNameValue,
            total: expense.amount,
          });
        }
      });

      const categoryBreakdown = Array.from(breakdownMap.values())
        .map(
          (item) =>
            new ExpenseCategoryBreakdownModel(
              item.categoryId,
              item.categoryName,
              Number(item.total.toFixed(2)),
              totalExpense
                ? Number(((item.total / totalExpense) * 100).toFixed(2))
                : 0,
            ),
        )
        .sort((a, b) => b.totalAmount - a.totalAmount);

      const topCategory =
        categoryBreakdown.length > 0
          ? new ExpenseTopCategoryModel(
              categoryBreakdown[0].categoryId,
              categoryBreakdown[0].categoryName,
              categoryBreakdown[0].totalAmount,
            )
          : null;

      return new ExpenseAnalyticsModel(
        Number(totalExpense.toFixed(2)),
        categoryBreakdown,
        topCategory,
      );
    } catch (error) {
      throw new DatabaseError("error generating expense analytics");
    }
  }

  private async assertCategoryExists(categoryId: CategoryId, userId: UserId): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: {
        id: uuidBuffer.toBuffer(categoryId),
      },
    });

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    if (category.userId !== null && category.userId !== userId) {
      throw new NotFoundError("Category not found for this user");
    }
  }
}

export default ExpenseService;
