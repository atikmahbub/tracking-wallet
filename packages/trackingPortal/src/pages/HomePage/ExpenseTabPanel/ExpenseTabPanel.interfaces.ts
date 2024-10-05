import { EAddExpenseFields } from "@trackingPortal/pages/HomePage/ExpenseTabPanel";

export interface INewExpense {
  [EAddExpenseFields.AMOUNT]: string;
  [EAddExpenseFields.DESCRIPTION]: string;
  [EAddExpenseFields.DATE]: string;
}

export interface IAddExpense {
  [EAddExpenseFields.EXPENSE_LIST]: INewExpense[];
}
