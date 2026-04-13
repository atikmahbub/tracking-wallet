import { IncomeCategoryId, UnixTimeStampString, UserId } from "@shared/primitives";

export interface IAddIncomeParams {
  userId: UserId;
  amount: number;
  description: string | null;
  date: UnixTimeStampString;
  categoryId?: IncomeCategoryId | null;
}
