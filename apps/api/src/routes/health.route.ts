import type { FastifyInstance } from "fastify";
import { checkDatabaseConnection } from "@wareflow/db";
import { env } from "@/config/env";
import { ApiResponse } from "@/core/api-response";
import { HTTP_STATUS } from "@/core/http-status";

async function pingDatabase(): Promise<boolean> {
  try {
    return await checkDatabaseConnection();
  } catch {
    return false;
  }
}

export async function healthRoute(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    "/api/health",
    {
      schema: {
        tags: ["Health"],
        summary: "Liveness and readiness probe",
        response: {
          200: {
            description: "Service is live; database readiness is reported in the body",
            type: "object",
            properties: {
              success: { type: "boolean" },
              statusCode: { type: "number" },
              message: { type: "string" },
              data: { type: "object", additionalProperties: true },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      const isDbConnected = await pingDatabase();
      const mem = process.memoryUsage();

      const data = {
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
        version: "0.0.1",
        checks: {
          database: {
            status: isDbConnected ? "connected" : "disconnected",
          },
          memory: {
            heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
            heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
            rss: Math.round(mem.rss / 1024 / 1024),
          },
        },
      };

      return reply.status(HTTP_STATUS.OK).send(ApiResponse.ok(data, "OK"));
    },
  );
}
