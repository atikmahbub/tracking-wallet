import { ExpenseModel } from "@tracking/models/Expense";
import { Expense, MonthlyLimit } from "@prisma/client";
import * as uuidBuffer from "uuid-buffer";
import {
  makeUnixTimestampString,
  UserId,
  ExpenseId,
  Month,
  Year,
  MonthlyLimitId,
} from "@shared/primitives";
import { MonthlyLimitModel } from "@tracking/models/MonthlyLimit";

export class PresentationService {
  public toExpenseModel(expense: Expense): ExpenseModel {
    return new ExpenseModel(
      ExpenseId(uuidBuffer.toString(expense.id)),
      UserId(expense.userId),
      expense.amount,
      expense.description,
      makeUnixTimestampString(expense.date.getTime()),
      makeUnixTimestampString(expense.updated.getTime()),
      makeUnixTimestampString(expense.created.getTime())
    );
  }

  public toMonthLimitModel(monthlyLimit: MonthlyLimit): MonthlyLimitModel {
    return new MonthlyLimitModel(
      MonthlyLimitId(uuidBuffer.toString(monthlyLimit.id)),
      UserId(monthlyLimit.userId),
      monthlyLimit.month as Month,
      monthlyLimit.year as Year,
      monthlyLimit.limit,
      makeUnixTimestampString(monthlyLimit.updated.getTime()),
      makeUnixTimestampString(monthlyLimit.created.getTime())
    );
  }
}
