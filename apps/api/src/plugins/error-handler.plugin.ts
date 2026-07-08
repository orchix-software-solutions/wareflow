import fp from "fastify-plugin";
import type { FastifyInstance, FastifyError } from "fastify";
import { ApiError, ValidationError, RateLimitError, InternalError } from "@/core/api-error";
import { HTTP_STATUS } from "@/core/http-status";

export default fp(
  async function errorHandlerPlugin(fastify: FastifyInstance) {
    fastify.setErrorHandler((error: FastifyError | ApiError, request, reply) => {
      if (error instanceof ApiError) {
        request.log.warn(
          {
            type: error.code,
            statusCode: error.statusCode,
            message: error.message,
            path: request.url,
            method: request.method,
            correlationId: request.correlationId,
          },
          "API error",
        );
        return reply.status(error.statusCode).send(error.toJSON());
      }

      if (error.statusCode === HTTP_STATUS.TOO_MANY_REQUESTS) {
        const retryAfter = Number(reply.getHeader("retry-after")) || undefined;
        const rateLimitError = new RateLimitError(retryAfter);
        return reply.status(HTTP_STATUS.TOO_MANY_REQUESTS).send(rateLimitError.toJSON());
      }

      if ("validation" in error && error.validation) {
        const errors = error.validation.map((v) => ({
          field: v.params?.missingProperty ?? "unknown",
          message: v.message ?? "Validation failed",
          source: "body",
        }));
        const firstMessage = errors[0]?.message || "Validation failed";
        const validationError = new ValidationError(errors, firstMessage);
        request.log.warn(
          {
            type: "VALIDATION_ERROR",
            statusCode: HTTP_STATUS.BAD_REQUEST,
            path: request.url,
            method: request.method,
            correlationId: request.correlationId,
          },
          "Fastify validation error",
        );
        return reply.status(HTTP_STATUS.BAD_REQUEST).send(validationError.toJSON());
      }

      request.log.error(
        {
          type: "UNHANDLED_ERROR",
          message: error.message,
          stack: error.stack,
          path: request.url,
          method: request.method,
          correlationId: request.correlationId,
        },
        "Unhandled error",
      );

      const internalError = new InternalError();
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(internalError.toJSON());
    });
  },
  { name: "error-handler" },
);
