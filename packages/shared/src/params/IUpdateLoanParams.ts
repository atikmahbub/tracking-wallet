import { LoanType } from "@shared/enums";
import { LoanId, UnixTimeStampString } from "@shared/primitives";

export interface IUpdateLoanParams {
  id: LoanId;
  amount?: number;
  name?: string;
  deadLine?: UnixTimeStampString;
  note?: string | null;
}
