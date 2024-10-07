import { LoanType } from "@shared/enums";
import { UnixTimeStampString, UserId } from "@shared/primitives";

export interface IAddLoanParams {
  userId: UserId;
  name: string;
  amount: number;
  deadLine: UnixTimeStampString;
  loanType: LoanType;
}
