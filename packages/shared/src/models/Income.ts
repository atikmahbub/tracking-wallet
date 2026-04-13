import {
  UnixTimeStampString,
  IncomeId,
  UserId,
  IncomeCategoryId,
} from "@shared/primitives";
import { IncomeCategoryModel } from "@shared/models/IncomeCategory";

export class NewIncome {
  constructor(
    public date: UnixTimeStampString,
    public amount: number,
    public description: string | null
  ) {}
}

export class IncomeModel extends NewIncome {
  constructor(
    public id: IncomeId,
    public userId: UserId,
    amount: number,
    description: string | null,
    date: UnixTimeStampString,
    public updated: UnixTimeStampString,
    public created: UnixTimeStampString,
    public categoryId: IncomeCategoryId | null = null,
    public category: IncomeCategoryModel | null = null
  ) {
    super(date, amount, description);
  }
}
