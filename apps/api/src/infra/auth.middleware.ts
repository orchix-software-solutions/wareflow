import type { FastifyReply, FastifyRequest } from "fastify";
import { AuthenticationError } from "@/core/api-error";
import { verifyAccessToken } from "./jwt";

const BEARER_PREFIX = "Bearer ";

/** Fastify preHandler that verifies the Authorization header and attaches the decoded user. */
export async function authenticate(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
    throw new AuthenticationError("Authentication required");
  }

  const token = authHeader.slice(BEARER_PREFIX.length).trim();

  try {
    request.user = verifyAccessToken(token);
  } catch {
    throw new AuthenticationError("Invalid or expired token");
  }
}
