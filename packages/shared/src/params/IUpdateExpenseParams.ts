import {
  CategoryId,
  ExpenseId,
  SavingsGoalId,
  UnixTimeStampString,
} from "@shared/primitives";

export interface IUpdateExpenseParams {
  id: ExpenseId;
  amount?: number;
  description?: string | null;
  date?: UnixTimeStampString;
  categoryId?: CategoryId | null;
  // undefined leaves it alone; null clears it
  savingsGoalId?: SavingsGoalId | null;
}
