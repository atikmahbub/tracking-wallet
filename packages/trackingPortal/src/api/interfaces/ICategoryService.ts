import { CategoryModel } from "@shared/models/Category";
import { IGetCategoriesParams } from "@shared/params";

import { ICreateCategoryParams, IUpdateCategoryParams } from "@shared/params";
import { CategoryId } from "@shared/primitives";

export interface ICategoryService {
  getCategories(params?: IGetCategoriesParams): Promise<CategoryModel[]>;
  createCategory(params: ICreateCategoryParams): Promise<CategoryModel>;
  updateCategory(params: IUpdateCategoryParams): Promise<CategoryModel>;
  deleteCategory(categoryId: CategoryId): Promise<void>;
}
