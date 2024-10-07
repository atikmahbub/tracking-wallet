import { LoanType } from "@shared/enums";
import { EAddLoanFields } from "@trackingPortal/pages/HomePage/LoanTabPanel";
import { Dayjs } from "dayjs";

export interface INewLoan {
  [EAddLoanFields.AMOUNT]: string;
  [EAddLoanFields.NAME]: string;
  [EAddLoanFields.LOAN_TYPE]: LoanType;
  [EAddLoanFields.DEADLINE]: Dayjs;
  [EAddLoanFields.NOTE]: string;
}

export interface IAddLoan {
  [EAddLoanFields.LOAN_LIST]: INewLoan[];
}
