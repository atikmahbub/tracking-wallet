import { EInvestStatus } from "@shared/enums";
import { UserId } from "@shared/primitives";

export interface IGetInvestParams {
  userId: UserId;
  status: EInvestStatus;
}
