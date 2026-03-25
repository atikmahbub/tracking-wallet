import { ECategoryType } from "@shared/enums";
import { UserId } from "@shared/primitives";

export interface IGetCategoriesParams {
  userId: UserId;
  type?: ECategoryType;
}
