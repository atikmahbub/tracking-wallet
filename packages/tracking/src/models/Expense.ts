import { UnixTimeStampString, ExpenseId, UserId } from "@shared/primitives";

export class NewExpense {
  constructor(
    public date: UnixTimeStampString,
    public amount: number,
    public description: string | null
  ) {}
}

export class ExpenseModel extends NewExpense {
  constructor(
    public id: ExpenseId,
    public userId: UserId,
    amount: number,
    description: string | null,
    date: UnixTimeStampString,
    public updated: UnixTimeStampString,
    public created: UnixTimeStampString
  ) {
    super(date, amount, description);
  }
}
