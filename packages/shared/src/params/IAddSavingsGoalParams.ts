import { UnixTimeStampString, UserId } from "@shared/primitives";

export interface IAddSavingsGoalParams {
  userId: UserId;
  name: string;
  icon: string;
  target: number;
  targetDate?: UnixTimeStampString | null;
  refill?: boolean;
}
