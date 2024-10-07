import { LoanType } from "@shared/enums";
import { UnixTimeStampString, LoanId, UserId } from "@shared/primitives";

export class NewLoan {
  constructor(
    public name: string,
    public amount: number,
    public deadLine: UnixTimeStampString,
    public loanType: LoanType
  ) {}
}

export class LoanModel extends NewLoan {
  constructor(
    public id: LoanId,
    public userId: UserId,
    name: string,
    amount: number,
    deadLine: UnixTimeStampString | null,
    loanType: LoanType,
    public created: UnixTimeStampString,
    public updated: UnixTimeStampString
  ) {
    super(name, amount, deadLine, loanType);
  }
}