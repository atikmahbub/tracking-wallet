import { EInvestStatus } from "@shared/enums";
import { InvestId, UnixTimeStampString } from "@shared/primitives";

export interface IUpdateInvestParams {
  id: InvestId;
  amount?: number;
  name?: string;
  note?: string;
  startDate?: UnixTimeStampString;
  endDate?: UnixTimeStampString;
  status?: EInvestStatus;
  earned?: number;
}
