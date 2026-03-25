import { ECategoryType } from "@shared/enums";
import { UserId } from "@shared/primitives";

export interface ICreateCategoryParams {
  userId: UserId;
  name: string;
  icon: string;
  color: string;
  type: ECategoryType;
}
