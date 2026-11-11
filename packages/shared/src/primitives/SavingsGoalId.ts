import { Brand, make } from "ts-brand";

export type SavingsGoalId = Brand<string, "SavingsGoalId">;
export const SavingsGoalId = make<SavingsGoalId>();
