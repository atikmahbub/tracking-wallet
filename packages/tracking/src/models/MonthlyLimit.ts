import { UserId, Month, Year, UnixTimeStampString } from "@shared/primitives";

export class NewMonthlyLimit {
  constructor(
    public userId: UserId,
    public month: Month,
    public year: Year,
    public limit: number
  ) {}
}

export class MonthlyLimit extends NewMonthlyLimit {
  constructor(
    userId: UserId,
    month: Month,
    year: Year,
    limit: number,
    public updated: UnixTimeStampString,
    public created: UnixTimeStampString
  ) {
    super(userId, month, year, limit);
  }
}
