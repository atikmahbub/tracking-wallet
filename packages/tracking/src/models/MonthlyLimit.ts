import { UserId, Month, Year } from "@shared/primitives";

export class MonthlyLimit {
  constructor(
    public userId: UserId,
    public month: Month,
    public year: Year,
    public limit: number
  ) {}
}
