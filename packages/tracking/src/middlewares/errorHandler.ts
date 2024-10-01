import { Request, Response, NextFunction } from "express";
import {
  UnAuthorizedError,
  DatabaseError,
  MissingFieldError,
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
  }

  return res.status(500).json({ error: "Internal server error" });
};
