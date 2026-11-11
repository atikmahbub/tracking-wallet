import { SavingsGoalKind } from "@shared/models/SavingsGoal";
import { UnixTimeStampString, UserId } from "@shared/primitives";

export interface IAddSavingsGoalParams {
  userId: UserId;
  name: string;
  icon: string;
  // Null for the general savings pot, which has no target.
  target: number | null;
  kind?: SavingsGoalKind;
  targetDate?: UnixTimeStampString | null;
  refill?: boolean;
}
