import { UnAuthorizedError } from "@tracking/errors";
import { Request, Response, NextFunction } from "express";
import jwksRsa from "jwks-rsa";
const { expressjwt: jwt } = require("express-jwt");

// Middleware for checking JWT and verifying with Auth0's JWKS

export const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by Auth0
  secret: jwksRsa.expressJwtSecret({
    cache: true, // Cache the signing key
    rateLimit: true, // Rate limit signing key requests to prevent abuse
    jwksRequestsPerMinute: 5, // Maximum number of JWKS requests per minute
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`, // JWKS URI for your Auth0 domain
  }),

  // Validate the audience and the issuer
  audience: process.env.AUTH0_AUDIENCE, // Your API's audience identifier
  issuer: `https://${process.env.AUTH0_DOMAIN}/`, // Auth0 domain as the issuer
  algorithms: ["RS256"], // Use RS256 for token signing
});

// Apply the `checkJwt` middleware to protect routes
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  checkJwt(req, res, (err: any) => {
    if (err) {
      return next(new UnAuthorizedError("Token is invalid or missing"));
    }
    next();
  });
};
