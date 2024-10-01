import { make, Brand } from "ts-brand";

export type UnixTimeStampString = Brand<string, "UnixTimeStampString">;

export const BrandUnixTimeStamp = make<UnixTimeStampString>();

export const makeUnixTimestampString = (
  timestamp: number
): UnixTimeStampString => {
  return BrandUnixTimeStamp(String(Math.floor(timestamp / 1000)));
};
