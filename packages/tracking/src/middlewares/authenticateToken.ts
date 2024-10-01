import { UnAuthorizedError } from "@tracking/errors";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new UnAuthorizedError("Token is required"));
  }

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err, user) => {
    if (err) {
      return next(new UnAuthorizedError("Invalid Token"));
    }

    req.user = user;
    next();
  });
};
