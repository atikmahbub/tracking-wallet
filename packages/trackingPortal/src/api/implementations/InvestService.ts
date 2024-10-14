import { InvestModel } from "@shared/models";
import {
  IAddInvestParams,
  IGetInvestParams,
  IUpdateInvestParams,
} from "@shared/params";
import { InvestId } from "@shared/primitives";
import { IInvestService } from "@trackingPortal/api/interfaces";
import { TrackingWalletConfig } from "@trackingPortal/api/TrackingWalletConfig";
import { IAxiosAjaxUtils } from "@trackingPortal/api/utils/IAxiosAjaxUtils";
import { extractApiError } from "@trackingPortal/utils/apiUtils";
import { urlJoin } from "url-join-ts";

export class InvestService implements IInvestService {
  constructor(
    protected config: TrackingWalletConfig,
    protected ajaxUtils: IAxiosAjaxUtils
  ) {}

  async addInvest(params: IAddInvestParams): Promise<InvestModel> {
    const url = new URL(urlJoin(this.config.baseUrl, "v0", "invest", "add"));
    const response = await this.ajaxUtils.post(url, { ...params });

    if (response.isOk()) {
      return response.value as InvestModel;
    }
    throw extractApiError(response.error);
  }

  async getInvestByUserId(params: IGetInvestParams): Promise<InvestModel[]> {
    const url = new URL(
      urlJoin(this.config.baseUrl, "v0", "invest", params.userId)
    );
    const response = await this.ajaxUtils.get(url, { ...params });

    if (response.isOk()) {
      return response.value as InvestModel[];
    }
    throw extractApiError(response.error);
  }

  async updateInvest(params: IUpdateInvestParams): Promise<InvestModel> {
    const url = new URL(
      urlJoin(this.config.baseUrl, "v0", "invest", params.id)
    );
    const response = await this.ajaxUtils.put(url, { ...params });

    if (response.isOk()) {
      return response.value as InvestModel;
    }
    throw extractApiError(response.error);
  }

  async deleteInvest(id: InvestId): Promise<void> {
    const url = new URL(urlJoin(this.config.baseUrl, "v0", "invest", id));
    const response = await this.ajaxUtils.delete(url);

    if (response.isOk()) {
      return response.value as void;
    }
    throw extractApiError(response.error);
  }
}
