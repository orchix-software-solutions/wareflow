import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    correlationId: string;
    requestStartTime: number;
  }
}
