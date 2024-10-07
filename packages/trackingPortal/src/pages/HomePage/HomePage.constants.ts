export enum ETabStep {
  Expense,
  Loan,
  Investment,
}

export enum ETabName {
  Expense = "expense",
  Loan = "loan",
  Investment = "investment",
}

export const tabItems = ["Expense", "Loan", "Investment"];

export const TabValueNameMap = {
  [ETabStep.Expense]: ETabName.Expense,
  [ETabStep.Loan]: ETabName.Loan,
  [ETabStep.Investment]: ETabName.Investment,
};

export const TabNameValueMap = {
  [ETabName.Expense]: ETabStep.Expense,
  [ETabName.Loan]: ETabStep.Loan,
  [ETabName.Investment]: ETabStep.Investment,
};
