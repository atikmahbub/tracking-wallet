import { PrismaClient } from "@prisma/client";
import { ExpenseModel } from "@tracking/models/Expense";
import { v4 } from "uuid";
import * as uuidBuffer from "uuid-buffer";
import { PresentationService } from "@tracking/utils/presentationService";
import { IAddExpenseParams } from "@shared/params";

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
          date: date,
          description: description,
        },
      });
      return this.presentationService.toExpenseModel(newExpense);
    } catch (error) {
      throw new Error("Error creating expense");
    }
  }
}

export default ExpenseService;
