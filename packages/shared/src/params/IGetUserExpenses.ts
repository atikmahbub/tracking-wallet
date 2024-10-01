import { UnixTimeStampString, UserId } from "@shared/primitives";

export interface IGetUserExpenses {
  userId: UserId;
  date: UnixTimeStampString;
}
