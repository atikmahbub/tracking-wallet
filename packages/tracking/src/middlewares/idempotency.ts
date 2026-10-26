import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { MissingFieldError } from "@tracking/errors";
import { isUniqueViolation } from "@tracking/utils/PrismaUtils";

/** A key with no stored response older than this is a crashed attempt. */
const ABANDONED_AFTER_MS = 2 * 60_000;
/** How long responses are kept for replay. */
const KEEP_FOR_MS = 30 * 24 * 60 * 60_000;
const MAX_KEY_LENGTH = 128;

/**
 * Makes a POST safe to retry. A client that sends an `Idempotency-Key`
 * header gets the stored response back when it resends the same request
 * (e.g. the first response was lost to a timeout), instead of a duplicate
 * row. Keys are scoped to the caller's token subject.
 *
 * A retry that arrives while the first attempt is still running gets 409.
 * 5xx and auth failures aren't stored, so those retries run again.
 */
export const idempotency =
  (prisma: PrismaClient) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("Idempotency-Key");
    if (req.method !== "POST" || !header) {
      return next();
    }
    if (header.length > MAX_KEY_LENGTH) {
      return next(new MissingFieldError("Idempotency-Key is too long"));
    }
    const subject = (req as any).auth?.sub ?? "anonymous";
    const key = `${subject}:${header}`;

    try {
      if (!(await claimKey(prisma, key))) {
        const saved = await prisma.idempotencyKey.findUnique({ where: { key } });
        if (saved?.status != null) {
          return res.status(saved.status).json(saved.body);
        }
        return res
          .status(409)
          .json({ error: "A request with this Idempotency-Key is in progress" });
      }
    } catch (error) {
      return next(error);
    }

    let body: unknown = null;
    const json = res.json.bind(res);
    res.json = (value: unknown) => {
      body = value;
      return json(value);
    };
    res.on("finish", () => {
      const status = res.statusCode;
      const keep = status < 500 && status !== 401 && status !== 409 && status !== 429;
      const done = keep
        ? prisma.idempotencyKey.update({
            where: { key },
            data: { status, body: (body ?? Prisma.JsonNull) as Prisma.InputJsonValue },
          })
        : prisma.idempotencyKey.delete({ where: { key } });
      done.catch((error) => console.log("idempotency key not saved", error));
    });
    next();
  };

/**
 * Inserts the key as "in progress". False when it already exists — unless
 * that earlier attempt was abandoned, in which case it's taken over.
 */
async function claimKey(prisma: PrismaClient, key: string): Promise<boolean> {
  try {
    await prisma.idempotencyKey.create({ data: { key } });
  } catch (error) {
    if (!isUniqueViolation(error)) throw error;
    const taken = await prisma.idempotencyKey.updateMany({
      where: {
        key,
        status: null,
        created: { lt: new Date(Date.now() - ABANDONED_AFTER_MS) },
      },
      data: { created: new Date() },
    });
    return taken.count > 0;
  }
  // Occasionally drop expired keys; no separate job needed.
  if (Math.random() < 0.01) {
    prisma.idempotencyKey
      .deleteMany({ where: { created: { lt: new Date(Date.now() - KEEP_FOR_MS) } } })
      .catch(() => {});
  }
  return true;
}
