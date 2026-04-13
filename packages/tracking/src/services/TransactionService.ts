import { PrismaClient } from "@prisma/client";
import { TransactionModel } from "@shared/models";
import { UserId, makeUnixTimestampString } from "@shared/primitives";
import * as uuidBuffer from "uuid-buffer";
import { DatabaseError } from "@tracking/errors";

export class TransactionService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getTransactions(userId: UserId, startDate?: Date, endDate?: Date): Promise<TransactionModel[]> {
    try {
      const dateFilter = startDate && endDate ? {
        gte: startDate,
        lte: endDate
      } : undefined;

      const [expenses, incomes] = await Promise.all([
        this.prisma.expense.findMany({
          where: { userId, date: dateFilter },
          include: { category: true },
        }),
        this.prisma.income.findMany({
          where: { userId, date: dateFilter },
          include: { category: true },
        })
      ]);

      const transactionExpenses: TransactionModel[] = expenses.map(exp => ({
        id: `exp_${uuidBuffer.toString(exp.id)}`,
        type: "expense",
        amount: exp.amount,
        description: exp.description,
        date: makeUnixTimestampString(exp.date.getTime()),
        category: exp.category ? {
          name: exp.category.name,
          icon: exp.category.icon,
          color: exp.category.color
        } : null
      }));

      const transactionIncomes: TransactionModel[] = incomes.map(inc => ({
        id: `inc_${uuidBuffer.toString(inc.id)}`,
        type: "income",
        amount: inc.amount,
        description: inc.description,
        date: makeUnixTimestampString(inc.date.getTime()),
        category: inc.category ? {
          name: inc.category.name,
          icon: inc.category.icon,
          color: inc.category.color
        } : null
      }));

      return [...transactionExpenses, ...transactionIncomes].sort((a, b) => {
          return Number(b.date) - Number(a.date);
      });
    } catch (error) {
      throw new DatabaseError("Error fetching transactions");
    }
  }
}

export default TransactionService;
