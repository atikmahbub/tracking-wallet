import {
  LoanId,
  LoanPaymentId,
  UnixTimeStampString,
  UserId,
} from "@shared/primitives";

/** "repayment" pays the loan down; "topup" adds to it (borrowed or lent more). */
export type LoanPaymentKind = "repayment" | "topup";

export class LoanPaymentModel {
  constructor(
    public id: LoanPaymentId,
    public loanId: LoanId,
    public userId: UserId,
    public amount: number,
    public date: UnixTimeStampString,
    public note: string | null,
    public created: UnixTimeStampString,
    public updated: UnixTimeStampString,
    public kind: LoanPaymentKind = "repayment"
  ) {}
}
