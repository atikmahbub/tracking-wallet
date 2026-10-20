import {
  LoanId,
  LoanPaymentId,
  UnixTimeStampString,
  UserId,
} from "@shared/primitives";

export class LoanPaymentModel {
  constructor(
    public id: LoanPaymentId,
    public loanId: LoanId,
    public userId: UserId,
    public amount: number,
    public date: UnixTimeStampString,
    public note: string | null,
    public created: UnixTimeStampString,
    public updated: UnixTimeStampString
  ) {}
}
