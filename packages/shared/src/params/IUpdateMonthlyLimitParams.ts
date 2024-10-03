import { Month, MonthlyLimitId, Year } from "@shared/primitives";

export interface IUpdateMonthlyLimitParams {
  id: MonthlyLimitId;
  month?: Month;
  year?: Year;
  limit?: number;
}
