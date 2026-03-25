import {
  CategoryId,
  ExpenseId,
  UnixTimeStampString,
} from "@shared/primitives";

export interface IUpdateExpenseParams {
  id: ExpenseId;
  amount?: number;
  description?: string | null;
  date?: UnixTimeStampString;
  categoryId?: CategoryId | null;
}
