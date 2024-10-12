import { EInvestStatus } from "@shared/enums";
import dayjs from "dayjs";
import { INewInvest } from "@trackingPortal/pages/HomePage/InvestTabPanel";
import * as Yup from "yup";

export const filterInvestByStatusMenu = [
  { value: EInvestStatus.Active, text: "Active" },
  { value: EInvestStatus.Completed, text: "Completed" },
];

export enum EAddInvestFormFields {
  NAME = "name",
  START_DATE = "start_date",
  END_DATE = "end_date",
  AMOUNT = "amount",
  NOTE = "note",
  PROFIT = "profit",
  INVEST_LIST = "invest_list",
}

export const defaultInvest: INewInvest = {
  [EAddInvestFormFields.NAME]: "",
  [EAddInvestFormFields.START_DATE]: dayjs(new Date()),
  [EAddInvestFormFields.AMOUNT]: "",
  [EAddInvestFormFields.NOTE]: "",
};

export const AddInvestSchema = Yup.object({
  [EAddInvestFormFields.INVEST_LIST]: Yup.array().of(
    Yup.object().shape({
      [EAddInvestFormFields.AMOUNT]: Yup.string()
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
      [EAddInvestFormFields.NAME]: Yup.string().required(
        "Name is a required field"
      ),
      [EAddInvestFormFields.NOTE]: Yup.string().required(
        "Note is a required field"
      ),
    })
  ),
});
