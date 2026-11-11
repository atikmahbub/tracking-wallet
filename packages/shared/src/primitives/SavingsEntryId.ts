import { Brand, make } from "ts-brand";

export type SavingsEntryId = Brand<string, "SavingsEntryId">;
export const SavingsEntryId = make<SavingsEntryId>();
