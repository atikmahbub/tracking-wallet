import { UserId } from "@shared/primitives";

export interface ICreateIncomeCategoryParams {
  name: string;
  icon: string;
  color: string;
  userId?: UserId | null;
}
