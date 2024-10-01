import { IGetMonthlyLimitParams } from "@shared/params/IGetMonthlyLimitParams";

export interface IAddMonthlyLimit extends IGetMonthlyLimitParams {
  limit: number;
}
