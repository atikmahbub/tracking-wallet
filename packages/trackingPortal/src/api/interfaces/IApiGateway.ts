import {
  ExpenseService,
  UserService,
  MonthlyLimitService,
} from "@trackingPortal/api/implementations";
import { TrackingWalletConfig } from "@trackingPortal/api/TrackingWalletConfig";
import { IAxiosAjaxUtils } from "@trackingPortal/api/utils/IAxiosAjaxUtils";

export interface IApiGateWay {
  config: TrackingWalletConfig;
  ajaxUtils: IAxiosAjaxUtils;
  userService: UserService;
  expenseService: ExpenseService;
  monthlyLimitService: MonthlyLimitService;
}
