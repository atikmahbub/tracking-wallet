import { MonthlyLimitModel } from "@shared/models/MonthlyLimit";
import {
  IAddMonthlyLimit,
  IGetMonthlyLimitParams,
  IUpdateMonthlyLimitParams,
} from "@shared/params";
import { MonthlyLimitId } from "@shared/primitives";

export interface IMonthlyLimitService {
  addMonthlyLimit(params: IAddMonthlyLimit): Promise<MonthlyLimitModel>;
  getMonthlyLimitByUserId(
    params: IGetMonthlyLimitParams
  ): Promise<MonthlyLimitModel>;
  updateMonthlyLimit(
    params: IUpdateMonthlyLimitParams
  ): Promise<MonthlyLimitModel>;
  deleteMonthlyLimit(id: MonthlyLimitId): Promise<void>;
}
