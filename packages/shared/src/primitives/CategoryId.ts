import { Brand, make } from "ts-brand";

export type CategoryId = Brand<string, "CategoryId">;
export const CategoryId = make<CategoryId>();
