import { IncomeCategoryId, IncomeId, UnixTimeStampString } from "@shared/primitives";

export interface IUpdateIncomeParams {
  id: IncomeId;
  amount?: number;
  description?: string | null;
  date?: UnixTimeStampString;
  categoryId?: IncomeCategoryId | null;
}
