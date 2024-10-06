import { EAddExpenseFields } from "@trackingPortal/pages/HomePage/ExpenseTabPanel";
import { Dayjs } from "dayjs";

export interface INewExpense {
  [EAddExpenseFields.AMOUNT]: string;
  [EAddExpenseFields.DESCRIPTION]: string;
  [EAddExpenseFields.DATE]: Dayjs;
}

export interface IAddExpense {
  [EAddExpenseFields.EXPENSE_LIST]: INewExpense[];
}
