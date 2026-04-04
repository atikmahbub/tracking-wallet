import { CategoryModel } from "@shared/models/Category";
import { IGetCategoriesParams } from "@shared/params";

export interface ICategoryService {
  getCategories(params?: IGetCategoriesParams): Promise<CategoryModel[]>;
}
