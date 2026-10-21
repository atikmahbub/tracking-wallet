import {
  RecurringRuleId,
  UnixTimeStampString,
  UserId,
} from "@shared/primitives";

export type RecurringFrequency = "weekly" | "monthly" | "yearly";
export type RecurringType = "expense" | "income";

export class RecurringRuleModel {
  constructor(
    public id: RecurringRuleId,
    public userId: UserId,
    public type: RecurringType,
    public amount: number,
    public description: string | null,
    // Expense or income category id, depending on type; not a foreign key.
    public categoryId: string | null,
    public frequency: RecurringFrequency,
    public startDate: UnixTimeStampString,
    public endDate: UnixTimeStampString | null,
    public pausedAt: UnixTimeStampString | null,
    // The latest occurrence a device has turned into a transaction.
    public lastRunDate: UnixTimeStampString | null,
    public created: UnixTimeStampString,
    public updated: UnixTimeStampString
  ) {}
}
