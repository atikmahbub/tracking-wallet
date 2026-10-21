import { RecurringRuleId, IncomeCategoryId, UnixTimeStampString, UserId } from "@shared/primitives";

export interface IAddIncomeParams {
  userId: UserId;
  amount: number;
  description: string | null;
  date: UnixTimeStampString;
  categoryId?: IncomeCategoryId | null;
  // Both or neither: the pair is unique, so a repeat add returns the existing row.
  recurringRuleId?: RecurringRuleId | null;
  occurrenceDate?: UnixTimeStampString | null;
}
