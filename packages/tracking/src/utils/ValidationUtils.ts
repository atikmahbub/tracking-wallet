import { MissingFieldError } from "@tracking/errors";
import { validate as isUuid } from "uuid";

const isUnixTimestamp = (value: unknown): boolean =>
  (typeof value === "string" || typeof value === "number") &&
  String(value).trim() !== "" &&
  Number.isFinite(Number(value));

// undefined and null are allowed; anything else must be Unix seconds
export function assertOptionalTimestamp(value: unknown, field: string): void {
  if (value !== undefined && value !== null && !isUnixTimestamp(value)) {
    throw new MissingFieldError(`${field} must be a Unix timestamp`);
  }
}

export function assertTimestamp(value: unknown, field: string): void {
  if (!isUnixTimestamp(value)) {
    throw new MissingFieldError(`${field} must be a Unix timestamp`);
  }
}

export function assertPositiveAmount(value: unknown): void {
  const amount = Number(value);
  if (
    value === null ||
    value === "" ||
    typeof value === "boolean" ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    throw new MissingFieldError("amount must be a positive number");
  }
}

export function assertUuid(value: unknown, field: string): void {
  if (typeof value !== "string" || !isUuid(value)) {
    throw new MissingFieldError(`${field} is invalid`);
  }
}
