import { Brand, make } from "ts-brand";

export type IncomeCategoryId = Brand<string, "IncomeCategoryId">;
export const IncomeCategoryId = make<IncomeCategoryId>();
