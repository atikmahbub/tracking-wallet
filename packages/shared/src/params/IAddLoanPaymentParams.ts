import { LoanId, UnixTimeStampString, UserId } from "@shared/primitives";

export interface IAddLoanPaymentParams {
  userId: UserId;
  loanId: LoanId;
  amount: number;
  date: UnixTimeStampString;
  note: string | null;
}
