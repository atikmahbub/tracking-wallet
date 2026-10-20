import { LoanPaymentId, UnixTimeStampString, UserId } from "@shared/primitives";

export interface IUpdateLoanPaymentParams {
  id: LoanPaymentId;
  userId: UserId;
  amount?: number;
  date?: UnixTimeStampString;
  note?: string | null;
}
