import { UnixTimeStampString, UserId } from "@shared/primitives";
import { RecurringFrequency, RecurringType } from "@shared/models/RecurringRule";

export interface IAddRecurringRuleParams {
  userId: UserId;
  type: RecurringType;
  amount: number;
  description: string | null;
  categoryId: string | null;
  frequency: RecurringFrequency;
  startDate: UnixTimeStampString;
  endDate: UnixTimeStampString | null;
  pausedAt: UnixTimeStampString | null;
  lastRunDate: UnixTimeStampString | null;
}
