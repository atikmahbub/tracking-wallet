import { UnixTimeStampString, UserId } from "@shared/primitives";

export interface IAddInvestParams {
  userId: UserId;
  name: string;
  amount: number;
  note: string;
  startDate: UnixTimeStampString;
  endDate?: UnixTimeStampString;
}
