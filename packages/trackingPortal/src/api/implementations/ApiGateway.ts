import {
  ExpenseService,
  MonthlyLimitService,
  UserService,
} from "@trackingPortal/api/implementations";
import { TrackingWalletConfig } from "@trackingPortal/api/TrackingWalletConfig";
import { AxiosAjaxUtils } from "@trackingPortal/api/utils/AxiosAjaxUtils";
import { IApiGateWay } from "@trackingPortal/api/interfaces";
import { URLString } from "@shared/primitives";

export class ApiGateway implements IApiGateWay {
  public config: TrackingWalletConfig;
  public ajaxUtils: AxiosAjaxUtils;
  public userService: UserService;
  public expenseService: ExpenseService;
  public monthlyLimitService: MonthlyLimitService;

  constructor() {
    this.config = new TrackingWalletConfig(
      URLString(process.env.REST_API_BASE_URL as URLString)
    );
    this.ajaxUtils = new AxiosAjaxUtils();

    this.userService = new UserService(this.config, this.ajaxUtils);
    this.expenseService = new ExpenseService(this.config, this.ajaxUtils);
    this.monthlyLimitService = new MonthlyLimitService(
      this.config,
      this.ajaxUtils
    );
  }
}
