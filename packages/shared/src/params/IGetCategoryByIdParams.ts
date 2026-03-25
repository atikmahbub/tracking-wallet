import { CategoryId, UserId } from "@shared/primitives";

export interface IGetCategoryByIdParams {
  categoryId: CategoryId;
  userId: UserId;
}
