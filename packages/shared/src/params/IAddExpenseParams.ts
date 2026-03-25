import { CategoryId, UnixTimeStampString, UserId } from "@shared/primitives";

export interface IAddExpenseParams {
  userId: UserId;
  amount: number;
  description: string | null;
  date: UnixTimeStampString;
  categoryId?: CategoryId | null;
}
