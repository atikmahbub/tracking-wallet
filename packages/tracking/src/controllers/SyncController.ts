import { Request, Response, NextFunction } from "express";
import SyncService from "@tracking/services/SyncService";
import { MissingFieldError } from "@tracking/errors";
import { UserId } from "@shared/primitives";
import { AuthenticationUtils } from "@tracking/utils/AuthenticationUtils";

class SyncController {
  constructor(private syncService: SyncService) {}

  /** GET /sync/changes?userId=&since= — `since` is a cursor from a previous call; omit for everything. */
  async getChanges(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const userId = req.query.userId as string;
      const rawSince = req.query.since as string | undefined;
      const since = rawSince ? Number(rawSince) : null;
      if (since != null && !Number.isFinite(since)) {
        throw new MissingFieldError("since must be a number");
      }

      const changes = await this.syncService.getChanges(UserId(userId), since);
      res.status(200).json(changes);
    } catch (error) {
      next(error);
    }
  }
}

export default SyncController;
