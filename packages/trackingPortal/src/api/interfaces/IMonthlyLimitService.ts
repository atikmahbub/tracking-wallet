import { MonthlyLimitModel } from "@shared/models/MonthlyLimit";
import {
  IAddMonthlyLimit,
  IGetMonthlyLimitParams,
  IUpdateMonthlyLimitParams,
} from "@shared/params";

export interface IMonthlyLimitService {
  addMonthlyLimit(params: IAddMonthlyLimit): Promise<MonthlyLimitModel>;
  getMonthlyLimitByUserId(
    params: IGetMonthlyLimitParams
  ): Promise<MonthlyLimitModel>;
  updateMonthlyLimit(
    params: IUpdateMonthlyLimitParams
  ): Promise<MonthlyLimitModel>;
}
