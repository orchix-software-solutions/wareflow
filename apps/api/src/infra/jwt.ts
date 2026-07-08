import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "@/config/env";

export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  role: string;
}

/** Signs a JWT access token for the given payload using the configured secret and expiry. */
export function signAccessToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

/** Verifies a JWT access token, returning its decoded payload. Throws on invalid/expired tokens. */
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
