import { PrismaClient } from "@prisma/client";
import * as uuidBuffer from "uuid-buffer";
import {
  CategoryModel,
  ExpenseModel,
  IncomeCategoryModel,
  IncomeModel,
  InvestModel,
  LoanModel,
  LoanPaymentModel,
  MonthlyLimitModel,
  RecurringRuleModel,
} from "@shared/models";
import { UserId } from "@shared/primitives";
import { DatabaseError } from "@tracking/errors";
import { PresentationService } from "@tracking/utils/presentationService";
import { SyncEntity } from "@tracking/utils/SyncUtils";

/**
 * Re-sends rows changed up to this long before `since`, so a write that
 * committed late (it began before the previous cursor was taken) is never
 * missed. Re-applying a row a device already has is harmless.
 */
const OVERLAP_MS = 60_000;

export interface SyncChanges {
  /** Pass back as `since` on the next call. Server time, epoch ms. */
  cursor: number;
  expenses: ExpenseModel[];
  incomes: IncomeModel[];
  categories: CategoryModel[];
  incomeCategories: IncomeCategoryModel[];
  loans: LoanModel[];
  loanPayments: LoanPaymentModel[];
  recurringRules: RecurringRuleModel[];
  invests: InvestModel[];
  monthlyLimits: MonthlyLimitModel[];
  deleted: { entity: SyncEntity; id: string }[];
}

/**
 * Everything that changed for a user since a cursor, for offline-first
 * clients: one request instead of a full re-fetch of every list.
 */
export class SyncService {
  private presentation = new PresentationService();

  constructor(private prisma: PrismaClient) {}

  async getChanges(userId: UserId, since: number | null): Promise<SyncChanges> {
    // Taken before reading, so anything written during the reads is
    // re-sent next time rather than skipped.
    const cursor = Date.now();
    const changed =
      since != null ? { updated: { gt: new Date(since - OVERLAP_MS) } } : {};
    const own = { userId, ...changed };

    try {
      const [
        expenses,
        incomes,
        categories,
        incomeCategories,
        loans,
        loanPayments,
        recurringRules,
        invests,
        monthlyLimits,
        tombstones,
      ] = await Promise.all([
        this.prisma.expense.findMany({ where: own, include: { category: true } }),
        this.prisma.income.findMany({ where: own, include: { category: true } }),
        // Defaults (no owner) are shared by everyone.
        this.prisma.category.findMany({
          where: { OR: [{ userId }, { userId: null }], ...changed },
        }),
        this.prisma.incomeCategory.findMany({
          where: { OR: [{ userId }, { userId: null }], ...changed },
        }),
        this.prisma.loan.findMany({ where: own }),
        this.prisma.loanPayment.findMany({ where: own }),
        this.prisma.recurringRule.findMany({ where: own }),
        this.prisma.invest.findMany({ where: own }),
        this.prisma.monthlyLimit.findMany({ where: own }),
        since != null
          ? this.prisma.tombstone.findMany({
              where: { userId, deleted: { gt: new Date(since - OVERLAP_MS) } },
            })
          : // A first sync has nothing local to delete.
            Promise.resolve([]),
      ]);

      const p = this.presentation;
      return {
        cursor,
        expenses: expenses.map((e) => p.toExpenseModel(e)),
        incomes: incomes.map((i) => p.toIncomeModel(i)),
        categories: categories.map((c) => p.toCategoryModel(c)),
        incomeCategories: incomeCategories.map((c) => p.toIncomeCategoryModel(c)),
        loans: loans.map((l) => p.toLoanModel(l)),
        loanPayments: loanPayments.map((l) => p.toLoanPaymentModel(l)),
        recurringRules: recurringRules.map((r) => p.toRecurringRuleModel(r)),
        invests: invests.map((i) => p.toInvestModel(i)),
        monthlyLimits: monthlyLimits.map((m) => p.toMonthLimitModel(m)),
        deleted: tombstones.map((t) => ({
          entity: t.entity as SyncEntity,
          id: uuidBuffer.toString(t.id),
        })),
      };
    } catch (error) {
      console.log("sync changes failed", error);
      throw new DatabaseError("Error reading changes");
    }
  }
}

export default SyncService;
