import { IAxiosAjaxUtils } from "@trackingPortal/api/utils/IAxiosAjaxUtils";
import { IExpenseService } from "@trackingPortal/api/interfaces";
import { TrackingWalletConfig } from "../TrackingWalletConfig";
import { ExpenseModel } from "@shared/models/Expense";
import {
  IAddExpenseParams,
  IGetUserExpenses,
  IUpdateExpenseParams,
} from "@shared/params";
import { extractApiError } from "@trackingPortal/utils/apiUtils";
import { urlJoin } from "url-join-ts";

export class ExpenseService implements IExpenseService {
  constructor(
    protected config: TrackingWalletConfig,
    protected ajaxUtils: IAxiosAjaxUtils
  ) {}

  async addExpense(params: IAddExpenseParams): Promise<ExpenseModel> {
    const url = new URL(urlJoin(this.config.baseUrl, "v0", "expense", "add"));
    const response = await this.ajaxUtils.post(url, { ...params });

    if (response.isOk()) {
      return response.value as ExpenseModel;
    }
    throw extractApiError(response.error);
  }

  async updateExpense(params: IUpdateExpenseParams): Promise<ExpenseModel> {
    const url = new URL(
      urlJoin(this.config.baseUrl, "v0", "expense", params.id)
    );
    const response = await this.ajaxUtils.put(url, { ...params });

    if (response.isOk()) {
      return response.value as ExpenseModel;
    }
    throw extractApiError(response.error);
  }

  async getExpenseByUser(params: IGetUserExpenses): Promise<ExpenseModel[]> {
    const url = new URL(
      urlJoin(this.config.baseUrl, "v0", "expenses", params.userId)
    );
    const response = await this.ajaxUtils.get(url, { ...params });

    if (response.isOk()) {
      return response.value as ExpenseModel[];
    }
    throw extractApiError(response.error);
  }
}
