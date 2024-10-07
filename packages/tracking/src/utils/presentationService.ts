import {
  ExpenseModel,
  UserModel,
  MonthlyLimitModel,
  LoanModel,
} from "@shared/models";
import { Expense, Loan, LoanType, MonthlyLimit, User } from "@prisma/client";
import * as uuidBuffer from "uuid-buffer";
import {
  makeUnixTimestampString,
  UserId,
  ExpenseId,
  Month,
  Year,
  MonthlyLimitId,
  URLString,
  LoanId,
} from "@shared/primitives";
import { LoanType as LoanTypeEnum } from "@shared/enums";

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

  public toUserModel(user: User): UserModel {
    return new UserModel(
      UserId(user.userId),
      user.name,
      user.email,
      URLString(user.profilePicture),
      makeUnixTimestampString(user.updated.getTime()),
      makeUnixTimestampString(user.created.getTime())
    );
  }

  public toLoanModel(loan: Loan): LoanModel {
    return new LoanModel(
      LoanId(uuidBuffer.toString(loan.id)),
      UserId(loan.userId),
      loan.name,
      loan.amount,
      loan.note,
      loan.deadLine ? makeUnixTimestampString(loan.deadLine.getTime()) : null,
      loan.loanType === LoanType.GIVEN
        ? LoanTypeEnum.GIVEN
        : LoanTypeEnum.TAKEN,
      makeUnixTimestampString(loan.updated.getTime()),
      makeUnixTimestampString(loan.created.getTime())
    );
  }
}
