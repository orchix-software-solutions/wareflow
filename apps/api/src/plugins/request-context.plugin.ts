import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";

export default fp(
  async function requestContextPlugin(fastify: FastifyInstance) {
    fastify.decorateRequest("correlationId", "");
    fastify.decorateRequest("requestStartTime", 0);

    fastify.addHook("onRequest", async (request) => {
      request.correlationId = (request.headers["x-correlation-id"] as string) ?? randomUUID();
      request.requestStartTime = Date.now();
    });

    fastify.addHook("onResponse", async (request, reply) => {
      const responseTime = Date.now() - request.requestStartTime;
      const logData = {
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        responseTime,
        correlationId: request.correlationId,
      };

      if (reply.statusCode >= 500) {
        request.log.error(logData, "Request completed with server error");
      } else if (reply.statusCode >= 400) {
        request.log.warn(logData, "Request completed with client error");
      } else {
        request.log.info(logData, "Request completed");
      }
    });
  },
  { name: "request-context" },
);
