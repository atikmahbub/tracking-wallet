import { ExpenseAnalyticsModel, ExpenseModel } from "@shared/models";
import {
  IAddExpenseParams,
  IGetExpenseAnalyticsParams,
  IGetUserExpenses,
  IUpdateExpenseParams,
} from "@shared/params";
import { ExpenseId } from "@shared/primitives";

export interface IExpenseService {
  addExpense: (params: IAddExpenseParams) => Promise<ExpenseModel>;
  updateExpense: (params: IUpdateExpenseParams) => Promise<ExpenseModel>;
  getExpenseByUser: (params: IGetUserExpenses) => Promise<ExpenseModel[]>;
  getExpenseAnalytics: (
    params: IGetExpenseAnalyticsParams
  ) => Promise<ExpenseAnalyticsModel>;
  deleteExpense(id: ExpenseId): Promise<void>;
}
