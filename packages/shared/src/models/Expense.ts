import {
  UnixTimeStampString,
  ExpenseId,
  UserId,
  CategoryId,
} from "@shared/primitives";
import { CategoryModel } from "@shared/models/Category";

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
    public created: UnixTimeStampString,
    public categoryId: CategoryId | null = null,
    public category: CategoryModel | null = null
  ) {
    super(date, amount, description);
  }
}
