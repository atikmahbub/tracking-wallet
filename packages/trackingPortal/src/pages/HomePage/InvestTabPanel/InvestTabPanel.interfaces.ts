import { EAddInvestFormFields } from "@trackingPortal/pages/HomePage/InvestTabPanel";
import { Dayjs } from "dayjs";

export interface INewInvest {
  [EAddInvestFormFields.NAME]: string;
  [EAddInvestFormFields.NOTE]: string;
  [EAddInvestFormFields.START_DATE]: Dayjs;
  [EAddInvestFormFields.AMOUNT]: string;
}

export interface IAddInvest {
  [EAddInvestFormFields.INVEST_LIST]: INewInvest[];
}
