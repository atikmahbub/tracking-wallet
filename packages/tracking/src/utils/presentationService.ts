import {
  ExpenseModel,
  UserModel,
  MonthlyLimitModel,
  LoanModel,
  InvestModel,
} from "@shared/models";
import {
  EInvestStatus,
  Expense,
  Invest,
  Loan,
  LoanType,
  MonthlyLimit,
  User,
} from "@prisma/client";
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
  InvestId,
} from "@shared/primitives";
import {
  LoanType as LoanTypeEnum,
  EInvestStatus as EInvestStatusEnum,
} from "@shared/enums";

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

  public toInvestModel(invest: Invest): InvestModel {
    return new InvestModel(
      InvestId(uuidBuffer.toString(invest.id)),
      invest.name,
      invest.amount,
      invest.note,
      makeUnixTimestampString(invest.startDate.getTime()),
      invest.endDate ? makeUnixTimestampString(invest.endDate.getTime()) : null,
      invest.status === EInvestStatus.ACTIVE
        ? EInvestStatusEnum.Active
        : EInvestStatusEnum.Completed,
      invest.earned,
      makeUnixTimestampString(invest.created.getTime()),
      makeUnixTimestampString(invest.updated.getTime())
    );
  }
}
