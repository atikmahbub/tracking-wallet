import { SavingsGoalId, UnixTimeStampString, UserId } from "@shared/primitives";

export interface IAddSavingsEntryParams {
  userId: UserId;
  goalId: SavingsGoalId;
  // Signed and never zero: positive adds, negative withdraws.
  amount: number;
  date: UnixTimeStampString;
  note: string | null;
}
