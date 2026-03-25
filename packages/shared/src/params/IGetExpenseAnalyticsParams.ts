import { UnixTimeStampString, UserId } from "@shared/primitives";

export interface IGetExpenseAnalyticsParams {
  userId: UserId;
  date: UnixTimeStampString;
}
