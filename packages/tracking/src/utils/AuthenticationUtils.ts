import { UnAuthorizedError } from "@tracking/errors";
import { Request } from "express";

export class AuthenticationUtils {
  public static assureUserHasUserId(req: Request): void {
    const userId = req.body.userId || req.params.userId || req.query.userId;

    if (!userId) {
      throw new UnAuthorizedError("User id is required");
    }
  }
}
