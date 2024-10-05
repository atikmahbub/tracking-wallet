import { INewExpense } from "@trackingPortal/pages/HomePage/ExpenseTabPanel/ExpenseTabPanel.interfaces";
import { format } from "date-fns";

export enum EMonthlyLimitFields {
  LIMIT = "limit",
}

export enum EAddExpenseFields {
  AMOUNT = "amount",
  DESCRIPTION = "description",
  DATE = "date",
  EXPENSE_LIST = "expense_list",
}

export const defaultQuestion: INewExpense = {
  [EAddExpenseFields.AMOUNT]: "",
  [EAddExpenseFields.DESCRIPTION]: "",
  [EAddExpenseFields.DATE]: format(new Date(), "yyyy-MM-dd"),
};
