import { PrismaClient } from "@prisma/client";
import { UserId } from "@shared/primitives";
import { DatabaseError } from "@tracking/errors";

export interface ITransactionSummary {
  totalExpense: number;
  totalIncome: number;
  expenseChangePercentage: number;
  incomeChangePercentage: number;
}

export class TransactionSummaryService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

async getMonthlySummary(
  userId: UserId,
  currentRange: { start: Date; end: Date },
  previousRange: { start: Date; end: Date }
): Promise<ITransactionSummary> {
  try {
    // ✅ Convert Date → UNIX seconds string
    const currentStart = Math.floor(currentRange.start.getTime() / 1000);
    const currentEnd = Math.floor(currentRange.end.getTime() / 1000);

    const previousStart = Math.floor(previousRange.start.getTime() / 1000);
    const previousEnd = Math.floor(previousRange.end.getTime() / 1000);

    const [
      currentExpense,
      currentIncome,
      previousExpense,
      previousIncome
    ] = await Promise.all([
      this.prisma.expense.aggregate({
        where: {
          userId,
          date: {
            gte: String(currentStart),
            lte: String(currentEnd),
          },
        },
        _sum: { amount: true },
      }),
      this.prisma.income.aggregate({
        where: {
          userId,
          date: {
            gte: String(currentStart),
            lte: String(currentEnd),
          },
        },
        _sum: { amount: true },
      }),
      this.prisma.expense.aggregate({
        where: {
          userId,
          date: {
            gte: String(previousStart),
            lte: String(previousEnd),
          },
        },
        _sum: { amount: true },
      }),
      this.prisma.income.aggregate({
        where: {
          userId,
          date: {
            gte: String(previousStart),
            lte: String(previousEnd),
          },
        },
        _sum: { amount: true },
      }),
    ]);

    const totalExpense = currentExpense._sum.amount ?? 0;
    const totalIncome = currentIncome._sum.amount ?? 0;
    const totalExpensePrev = previousExpense._sum.amount ?? 0;
    const totalIncomePrev = previousIncome._sum.amount ?? 0;

    const expenseChangePercentage = this.calculatePercentageChange(
      totalExpense,
      totalExpensePrev
    );
    const incomeChangePercentage = this.calculatePercentageChange(
      totalIncome,
      totalIncomePrev
    );

    return {
      totalExpense: Number(totalExpense.toFixed(2)),
      totalIncome: Number(totalIncome.toFixed(2)),
      expenseChangePercentage: Number(expenseChangePercentage.toFixed(2)),
      incomeChangePercentage: Number(incomeChangePercentage.toFixed(2)),
    };
  } catch (error) {
    throw new DatabaseError("Error calculating transaction summary");
  }
}

  private calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return ((current - previous) / previous) * 100;
  }
}

export default TransactionSummaryService;
