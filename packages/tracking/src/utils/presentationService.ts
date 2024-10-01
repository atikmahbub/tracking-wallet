import { ExpenseModel } from "@tracking/models/Expense";
import { Expense } from "@prisma/client";
import * as uuidBuffer from "uuid-buffer";
import { makeUnixTimestampString, UserId, ExpenseId } from "@shared/primitives";

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
}
