import { INewExpense } from "@trackingPortal/pages/HomePage/ExpenseTabPanel/ExpenseTabPanel.interfaces";
import dayjs from "dayjs";
import * as Yup from "yup";

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
  [EAddExpenseFields.DATE]: dayjs(new Date(), "yyyy-MM-dd"),
};

export const CreateExpenseSchema = Yup.object({
  [EAddExpenseFields.EXPENSE_LIST]: Yup.array().of(
    Yup.object().shape({
      [EAddExpenseFields.AMOUNT]: Yup.string()
        .required("Amount is required!")
        .test(
          "is-valid-amount",
          'Amount must be a positive number or end with "K" or "k" (e.g., 2000, 2K, 2k)',
          function (value) {
            if (!value) return false;

            const isNumeric = /^\d+$/.test(value); // Only positive numbers
            const isKFormat = /^\d+[Kk]$/.test(value); // Ends with 'K' or 'k'

            // Convert the numeric part to a number and check if it's positive
            if (isNumeric || isKFormat) {
              const numericValue = parseInt(value.replace(/[Kk]/, ""), 10);
              return numericValue > 0;
            }

            return false; // Invalid if it doesn't match the format or is negative
          }
        ),
      [EAddExpenseFields.DESCRIPTION]: Yup.string().max(
        128,
        "Max 256 character allowed"
      ),
    })
  ),
});
