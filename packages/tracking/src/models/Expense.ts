import { UnixTimeStampString, ExpenseId, UserId } from "@shared/primitives";

export class NewExpense {
  constructor(
    public date: UnixTimeStampString,
    public amount: number,
    public description: string
  ) {}
}

export class ExpenseModel extends NewExpense {
  constructor(
    public id: ExpenseId,
    public userId: UserId,
    amount: number,
    description: string,
    date: UnixTimeStampString,
    public update: UnixTimeStampString,
    public created: UnixTimeStampString
  ) {
    super(date, amount, description);
  }
}
