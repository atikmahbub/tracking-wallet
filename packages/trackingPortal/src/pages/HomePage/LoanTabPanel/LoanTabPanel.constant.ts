import * as Yup from "yup";
import { INewLoan } from "@trackingPortal/pages/HomePage/LoanTabPanel";
import { LoanType } from "@shared/enums";
import dayjs from "dayjs";

export enum EAddLoanFields {
  NAME = "name",
  LOAN_TYPE = "loan_type",
  AMOUNT = "amount",
  DEADLINE = "deadLine",
  NOTE = "note",
  LOAN_LIST = "loan_list",
}

export const loanTypeOptions = [
  { text: "Giving To", value: LoanType.GIVEN },
  { text: "Taking From", value: LoanType.TAKEN },
];

export const defaultLoan: INewLoan = {
  [EAddLoanFields.AMOUNT]: "",
  [EAddLoanFields.NAME]: "",
  [EAddLoanFields.LOAN_TYPE]: LoanType.GIVEN,
  [EAddLoanFields.DEADLINE]: dayjs(new Date()),
  [EAddLoanFields.NOTE]: "",
};

export const AddLoanSchema = Yup.object({
  [EAddLoanFields.LOAN_LIST]: Yup.array().of(
    Yup.object().shape({
      [EAddLoanFields.AMOUNT]: Yup.string()
        .required("Amount is required!")
        .test(
          "is-valid-amount",
          'Amount must be a positive number or end with "K" or "k" (e.g., 2000, 2K, 2k)',
          function (value) {
            if (!value) return false;

            const isNumeric = /^\d+$/.test(value);
            const isKFormat = /^\d+[Kk]$/.test(value);

            if (isNumeric || isKFormat) {
              const numericValue = parseInt(value.replace(/[Kk]/, ""), 10);
              return numericValue > 0;
            }
            return false;
          }
        ),
      [EAddLoanFields.NAME]: Yup.string().required("Name is required field!"),
    })
  ),
});
