import { ExpenseModel } from "@shared/models/Expense";
import {
  IAddExpenseParams,
  IGetUserExpenses,
  IUpdateExpenseParams,
} from "@shared/params";
import { ExpenseId } from "@shared/primitives";

export interface IExpenseService {
  addExpense: (params: IAddExpenseParams) => Promise<ExpenseModel>;
  updateExpense: (params: IUpdateExpenseParams) => Promise<ExpenseModel>;
  getExpenseByUser: (params: IGetUserExpenses) => Promise<ExpenseModel[]>;
  deleteExpense(id: ExpenseId): Promise<void>;
}
