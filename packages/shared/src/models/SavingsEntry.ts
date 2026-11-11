import {
  SavingsEntryId,
  SavingsGoalId,
  UnixTimeStampString,
  UserId,
} from "@shared/primitives";

/** `amount` is signed: positive adds to the goal, negative withdraws. */
export class SavingsEntryModel {
  constructor(
    public id: SavingsEntryId,
    public goalId: SavingsGoalId,
    public userId: UserId,
    public amount: number,
    public date: UnixTimeStampString,
    public note: string | null,
    public created: UnixTimeStampString,
    public updated: UnixTimeStampString
  ) {}
}
