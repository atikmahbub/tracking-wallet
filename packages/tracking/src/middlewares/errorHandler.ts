import { Request, Response, NextFunction } from "express";
import {
  UnAuthorizedError,
  DatabaseError,
  MissingFieldError,
  NotFoundError,
} from "@tracking/errors";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof UnAuthorizedError) {
    return res.status(401).json({ error: err.message });
  } else if (err instanceof DatabaseError) {
    return res.status(500).json({ error: err.message });
  } else if (err instanceof MissingFieldError) {
    return res.status(400).json({ error: err.message });
  } else if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }

  return res.status(500).json({ error: "Internal server error" });
};
