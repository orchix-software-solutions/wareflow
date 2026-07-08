import "fastify";
import type { JwtPayload } from "@/infra/jwt";

declare module "fastify" {
  interface FastifyRequest {
    correlationId: string;
    requestStartTime: number;
    user?: JwtPayload;
  }
}
