import { IAxiosAjaxUtils } from "@trackingPortal/api/utils/IAxiosAjaxUtils";
import { ICategoryService } from "@trackingPortal/api/interfaces";
import { TrackingWalletConfig } from "../TrackingWalletConfig";
import { CategoryModel } from "@shared/models/Category";
import { IGetCategoriesParams } from "@shared/params";
import { extractApiError } from "@trackingPortal/utils/apiUtils";
import { urlJoin } from "url-join-ts";

export class CategoryService implements ICategoryService {
  constructor(
    protected config: TrackingWalletConfig,
    protected ajaxUtils: IAxiosAjaxUtils
  ) {}

  async getCategories(params?: IGetCategoriesParams): Promise<CategoryModel[]> {
    const url = new URL(urlJoin(this.config.baseUrl, "v0", "categories"));
    const response = await this.ajaxUtils.get(url, { ...params });

    if (response.isOk()) {
      return response.value as CategoryModel[];
    }
    throw extractApiError(response.error);
  }
}
