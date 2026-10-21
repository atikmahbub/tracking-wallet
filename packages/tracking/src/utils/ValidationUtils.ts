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

export function assertOneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
  field: string
): asserts value is T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new MissingFieldError(`${field} must be one of ${allowed.join(", ")}`);
  }
}

// undefined and null are allowed; anything else must be a uuid
export function assertOptionalUuid(value: unknown, field: string): void {
  if (value !== undefined && value !== null) {
    assertUuid(value, field);
  }
}

// A generated entry carries both its rule and the occurrence it was made for.
export function assertRecurringOccurrence(
  recurringRuleId: unknown,
  occurrenceDate: unknown
): void {
  const hasRule = recurringRuleId !== undefined && recurringRuleId !== null;
  const hasDate = occurrenceDate !== undefined && occurrenceDate !== null;
  if (hasRule !== hasDate) {
    throw new MissingFieldError(
      "recurringRuleId and occurrenceDate must be sent together"
    );
  }
  assertOptionalUuid(recurringRuleId, "recurringRuleId");
  assertOptionalTimestamp(occurrenceDate, "occurrenceDate");
}
