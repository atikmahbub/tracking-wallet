import { SavingsGoalId, UnixTimeStampString, UserId } from "@shared/primitives";

export interface IUpdateSavingsGoalParams {
  id: SavingsGoalId;
  userId: UserId;
  name?: string;
  icon?: string;
  target?: number;
  // undefined leaves it alone; null clears it
  targetDate?: UnixTimeStampString | null;
  refill?: boolean;
  reachedAt?: UnixTimeStampString | null;
}
