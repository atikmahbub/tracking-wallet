import { SavingsEntryId, UnixTimeStampString, UserId } from "@shared/primitives";

export interface IUpdateSavingsEntryParams {
  id: SavingsEntryId;
  userId: UserId;
  amount?: number;
  date?: UnixTimeStampString;
  note?: string | null;
}
