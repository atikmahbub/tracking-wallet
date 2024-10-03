import { PrismaClient } from "@prisma/client";
import { ExpenseModel } from "@tracking/models/Expense";
import { v4 } from "uuid";
import * as uuidBuffer from "uuid-buffer";
import { PresentationService } from "@tracking/utils/presentationService";
import { IAddExpenseParams, IUpdateExpenseParams } from "@shared/params";
import { makeUnixTimestampToISOString, UserId } from "@shared/primitives";
import { DatabaseError } from "@tracking/errors";

class ExpenseService {
  private prisma: PrismaClient;
  private presentationService: PresentationService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.presentationService = new PresentationService();
  }

  async addExpense(params: IAddExpenseParams): Promise<ExpenseModel> {
    try {
      const { userId, description, date, amount } = params;

      const newExpense = await this.prisma.expense.create({
        data: {
          id: uuidBuffer.toBuffer(v4()),
          userId: userId,
          amount: amount,
          date: makeUnixTimestampToISOString(Number(date)),
          description: description,
        },
      });
      return this.presentationService.toExpenseModel(newExpense);
    } catch (error) {
      throw new DatabaseError("Error creating expense");
    }
  }

  async getExpenseByUserIdAndMonth(
    userId: UserId,
    startDate: Date,
    endDate: Date
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
      });

      return expenses.map((expense) =>
        this.presentationService.toExpenseModel(expense)
      );
    } catch (error) {
      throw new DatabaseError("Error in getting expenses");
    }
  }

  async updateExpense(params: IUpdateExpenseParams): Promise<ExpenseModel> {
    try {
      const { id, amount, date, description } = params;

      const updatedExpense = await this.prisma.expense.update({
        where: {
          id: uuidBuffer.toBuffer(id),
        },
        data: {
          amount: amount,
          date: date ? makeUnixTimestampToISOString(Number(date)) : undefined,
          description: description,
        },
      });

      return this.presentationService.toExpenseModel(updatedExpense);
    } catch (error) {
      throw new DatabaseError("error in updating the expense");
    }
  }
}

export default ExpenseService;
