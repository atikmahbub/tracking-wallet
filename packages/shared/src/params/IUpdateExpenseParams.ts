import { ExpenseId, UnixTimeStampString, UserId } from "@shared/primitives";

export interface IUpdateExpenseParams {
  id: ExpenseId;
  amount?: number;
  description?: string | null;
  date?: UnixTimeStampString;
}
