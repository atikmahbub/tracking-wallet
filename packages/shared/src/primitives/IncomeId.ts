import { Brand, make } from "ts-brand";

export type IncomeId = Brand<string, "IncomeId">;
export const IncomeId = make<IncomeId>();
