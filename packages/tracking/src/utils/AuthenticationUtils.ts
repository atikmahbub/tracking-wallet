import { UnAuthorizedError } from "@tracking/errors";
import { Request, Response, NextFunction } from "express";

export class AuthenticationUtils {
  public static assureUserHasUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userId = req.body || req.params || req.query;

    if (!userId) {
      return next(new UnAuthorizedError("User id is required"));
    }

    next();
  }
}
