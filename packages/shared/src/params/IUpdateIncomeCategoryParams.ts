import { IncomeCategoryId, UserId } from "@shared/primitives";

export interface IUpdateIncomeCategoryParams {
  incomeCategoryId: IncomeCategoryId;
  name: string;
  icon: string;
  color: string;
  userId: UserId;
}
