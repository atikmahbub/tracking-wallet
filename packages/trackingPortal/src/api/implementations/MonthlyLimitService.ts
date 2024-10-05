import { MonthlyLimitModel } from "@shared/models/MonthlyLimit";
import {
  IAddMonthlyLimit,
  IGetMonthlyLimitParams,
  IUpdateMonthlyLimitParams,
} from "@shared/params";
import { IAxiosAjaxUtils } from "@trackingPortal/api/utils/IAxiosAjaxUtils";
import { TrackingWalletConfig } from "@trackingPortal/api/TrackingWalletConfig";
import { IMonthlyLimitService } from "@trackingPortal/api/interfaces";
import { extractApiError } from "@trackingPortal/utils/apiUtils";
import { urlJoin } from "url-join-ts";
import { MonthlyLimitId } from "@shared/primitives";

export class MonthlyLimitService implements IMonthlyLimitService {
  constructor(
    protected config: TrackingWalletConfig,
    protected ajaxUtils: IAxiosAjaxUtils
  ) {}

  async addMonthlyLimit(params: IAddMonthlyLimit): Promise<MonthlyLimitModel> {
    const url = new URL(
      urlJoin(this.config.baseUrl, "v0", "monthly-limit", "add")
    );
    const response = await this.ajaxUtils.post(url, { ...params });

    if (response.isOk()) {
      return response.value as MonthlyLimitModel;
    }
    throw extractApiError(response.error);
  }

  async getMonthlyLimitByUserId(
    params: IGetMonthlyLimitParams
  ): Promise<MonthlyLimitModel> {
    const url = new URL(
      urlJoin(this.config.baseUrl, "v0", "monthly-limit", params.userId)
    );

    const response = await this.ajaxUtils.get(url, { ...params });

    if (response.isOk()) {
      return response.value as MonthlyLimitModel;
    }
    throw extractApiError(response.error);
  }

  async updateMonthlyLimit(
    params: IUpdateMonthlyLimitParams
  ): Promise<MonthlyLimitModel> {
    const url = new URL(
      urlJoin(this.config.baseUrl, "v0", "monthly-limit", params.id)
    );
    const response = await this.ajaxUtils.put(url, { ...params });

    if (response.isOk()) {
      return response.value as MonthlyLimitModel;
    }
    throw extractApiError(response.error);
  }

  async deleteMonthlyLimit(id: MonthlyLimitId): Promise<void> {
    const url = new URL(
      urlJoin(this.config.baseUrl, "v0", "monthly-limit", id)
    );
    const response = await this.ajaxUtils.delete(url);

    if (response.isOk()) {
      return response.value as void;
    }
    throw extractApiError(response.error);
  }
}
