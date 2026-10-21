import { RecurringRuleId, UnixTimeStampString, UserId } from "@shared/primitives";
import { RecurringFrequency } from "@shared/models/RecurringRule";

// Absent = unchanged; null clears endDate / pausedAt / lastRunDate.
export interface IUpdateRecurringRuleParams {
  id: RecurringRuleId;
  userId: UserId;
  amount?: number;
  description?: string | null;
  categoryId?: string | null;
  frequency?: RecurringFrequency;
  startDate?: UnixTimeStampString;
  endDate?: UnixTimeStampString | null;
  pausedAt?: UnixTimeStampString | null;
  lastRunDate?: UnixTimeStampString | null;
}
