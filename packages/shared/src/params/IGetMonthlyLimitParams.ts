import { Month, UserId, Year } from "@shared/primitives";

export interface IGetMonthlyLimitParams {
  userId: UserId;
  month: Month;
  year: Year;
}
