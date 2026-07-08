import type { FastifyRequest, FastifyReply } from "fastify";
import { ApiError, InternalError } from "./api-error";

type AsyncRouteHandler = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<void | FastifyReply>;

/** Wraps an async route handler to forward errors to the Fastify error handler. */
export function asyncHandler(handler: AsyncRouteHandler): AsyncRouteHandler {
  const wrapped = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void | FastifyReply> => {
    try {
      return await handler(request, reply);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new InternalError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    }
  };

  Object.defineProperty(wrapped, "name", { value: handler.name });
  return wrapped;
}
