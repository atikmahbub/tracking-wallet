import { IAxiosAjaxUtils } from "@trackingPortal/api/utils/IAxiosAjaxUtils";
import { ICategoryService } from "@trackingPortal/api/interfaces";
import { TrackingWalletConfig } from "../TrackingWalletConfig";
import { CategoryModel } from "@shared/models/Category";
import { IGetCategoriesParams } from "@shared/params";
import { extractApiError } from "@trackingPortal/utils/apiUtils";
import { urlJoin } from "url-join-ts";

import { ICreateCategoryParams, IUpdateCategoryParams } from "@shared/params";
import { CategoryId } from "@shared/primitives";

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

  async createCategory(params: ICreateCategoryParams): Promise<CategoryModel> {
    const url = new URL(urlJoin(this.config.baseUrl, "v0", "categories"));
    const response = await this.ajaxUtils.post(url, params);

    if (response.isOk()) {
      return response.value as CategoryModel;
    }
    throw extractApiError(response.error);
  }

  async updateCategory(params: IUpdateCategoryParams): Promise<CategoryModel> {
    const url = new URL(urlJoin(this.config.baseUrl, "v0", "categories", params.categoryId));
    const response = await this.ajaxUtils.put(url, params);

    if (response.isOk()) {
      return response.value as CategoryModel;
    }
    throw extractApiError(response.error);
  }

  async deleteCategory(categoryId: CategoryId): Promise<void> {
    const url = new URL(urlJoin(this.config.baseUrl, "v0", "categories", categoryId));
    const response = await this.ajaxUtils.delete(url);

    if (response.isOk()) {
      return;
    }
    throw extractApiError(response.error);
  }
}
