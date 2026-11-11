import { SavingsGoalId, UnixTimeStampString, UserId } from "@shared/primitives";

export type SavingsGoalKind = "goal" | "general";

export class SavingsGoalModel {
  constructor(
    public id: SavingsGoalId,
    public userId: UserId,
    public name: string,
    public icon: string,
    // Null for the general savings pot, which has no target.
    public target: number | null,
    // "goal" or "general": one target-less pot per user.
    public kind: SavingsGoalKind,
    public targetDate: UnixTimeStampString | null,
    // Keep asking for the target again after the money is used.
    public refill: boolean,
    // Set once, when the saved amount first reaches the target.
    public reachedAt: UnixTimeStampString | null,
    public created: UnixTimeStampString,
    public updated: UnixTimeStampString
  ) {}
}
