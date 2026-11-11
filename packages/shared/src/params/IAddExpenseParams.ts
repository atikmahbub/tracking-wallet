import { RecurringRuleId, CategoryId, SavingsGoalId, UnixTimeStampString, UserId } from "@shared/primitives";

export interface IAddExpenseParams {
  userId: UserId;
  amount: number;
  description: string | null;
  date: UnixTimeStampString;
  categoryId?: CategoryId | null;
  // Both or neither: the pair is unique, so a repeat add returns the existing row.
  recurringRuleId?: RecurringRuleId | null;
  occurrenceDate?: UnixTimeStampString | null;
  // Paid out of this savings goal.
  savingsGoalId?: SavingsGoalId | null;
}
