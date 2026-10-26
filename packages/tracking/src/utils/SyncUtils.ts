import { PrismaClient } from "@prisma/client";

/** Entity names used in tombstones and the delta sync response. */
export type SyncEntity =
  | "expense"
  | "income"
  | "category"
  | "incomeCategory"
  | "loan"
  | "loanPayment"
  | "recurringRule"
  | "invest"
  | "monthlyLimit";

/**
 * Remembers that a row was deleted, so `GET /sync/changes` can tell other
 * devices. Run it in the same `$transaction` as the delete.
 */
export const recordTombstone = (
  prisma: PrismaClient,
  entity: SyncEntity,
  id: Buffer,
  userId: string | null
) =>
  prisma.tombstone.upsert({
    where: { entity_id: { entity, id } },
    create: { entity, id, userId },
    update: { userId, deleted: new Date() },
  });
