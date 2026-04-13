import {
  ExpenseModel,
  UserModel,
  MonthlyLimitModel,
  LoanModel,
  InvestModel,
  CategoryModel,
  IncomeModel,
  IncomeCategoryModel,
} from "@shared/models";
import {
  EInvestStatus,
  Expense,
  Invest,
  Loan,
  LoanType,
  MonthlyLimit,
  User,
  Category,
  Income,
  IncomeCategory,
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
  CategoryId,
  IncomeId,
  IncomeCategoryId,
} from "@shared/primitives";
import {
  LoanType as LoanTypeEnum,
  EInvestStatus as EInvestStatusEnum,
} from "@shared/enums";

export class PresentationService {
  public toExpenseModel(
    expense: Expense & { category?: Category | null }
  ): ExpenseModel {
    const categoryModel =
      expense.category && expense.categoryId
        ? this.toCategoryModel(expense.category)
        : null;

    return new ExpenseModel(
      ExpenseId(uuidBuffer.toString(expense.id)),
      UserId(expense.userId),
      expense.amount,
      expense.description,
      makeUnixTimestampString(expense.date.getTime()),
      makeUnixTimestampString(expense.updated.getTime()),
      makeUnixTimestampString(expense.created.getTime()),
      expense.categoryId
        ? CategoryId(uuidBuffer.toString(expense.categoryId))
        : null,
      categoryModel
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

  public toCategoryModel(category: Category): CategoryModel {
    return new CategoryModel(
      CategoryId(uuidBuffer.toString(category.id)),
      category.name,
      category.icon,
      category.color,
      makeUnixTimestampString(category.created.getTime()),
      makeUnixTimestampString(category.updated.getTime())
    );
  }

  public toIncomeModel(
    income: Income & { category?: IncomeCategory | null }
  ): IncomeModel {
    const categoryModel =
      income.category && income.categoryId
        ? this.toIncomeCategoryModel(income.category)
        : null;

    return new IncomeModel(
      IncomeId(uuidBuffer.toString(income.id)),
      UserId(income.userId),
      income.amount,
      income.description,
      makeUnixTimestampString(income.date.getTime()),
      makeUnixTimestampString(income.updated.getTime()),
      makeUnixTimestampString(income.created.getTime()),
      income.categoryId
        ? IncomeCategoryId(uuidBuffer.toString(income.categoryId))
        : null,
      categoryModel
    );
  }

  public toIncomeCategoryModel(category: IncomeCategory): IncomeCategoryModel {
    return new IncomeCategoryModel(
      IncomeCategoryId(uuidBuffer.toString(category.id)),
      category.name,
      category.icon,
      category.color,
      category.userId ? UserId(category.userId) : null,
      makeUnixTimestampString(category.created.getTime()),
      makeUnixTimestampString(category.updated.getTime())
    );
  }
}
