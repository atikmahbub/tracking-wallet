import { make, Brand } from "ts-brand";

export type UnixTimeStampString = Brand<string, "UnixTimeStampString">;
export const UnixTimeStampString = make<UnixTimeStampString>();
