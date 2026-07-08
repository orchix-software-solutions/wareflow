import type { FastifyRequest } from "fastify";
import { type ZodSchema, ZodError } from "zod";
import { ValidationError } from "./api-error";

interface ValidateOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

interface FormattedError {
  field: string;
  message: string;
  source: "body" | "query" | "params";
  path: string[];
}

/** Formats Zod issues into clean error objects for API responses. */
export function formatZodErrors(
  error: ZodError,
  source: "body" | "query" | "params",
): FormattedError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
    source,
    path: issue.path.map(String),
  }));
}

/**
 * Validates request body, query, and params against Zod schemas.
 * Replaces the request properties with parsed (cleaned) values on success.
 * Throws a ValidationError with all collected errors on failure.
 */
export function validateRequest(request: FastifyRequest, schemas: ValidateOptions): void {
  const errors: FormattedError[] = [];

  if (schemas.body) {
    const result = schemas.body.safeParse(request.body);
    if (result.success) {
      (request.body as unknown) = result.data;
    } else {
      errors.push(...formatZodErrors(result.error, "body"));
    }
  }

  if (schemas.query) {
    const result = schemas.query.safeParse(request.query);
    if (result.success) {
      (request.query as unknown) = result.data;
    } else {
      errors.push(...formatZodErrors(result.error, "query"));
    }
  }

  if (schemas.params) {
    const result = schemas.params.safeParse(request.params);
    if (result.success) {
      (request.params as unknown) = result.data;
    } else {
      errors.push(...formatZodErrors(result.error, "params"));
    }
  }

  if (errors.length > 0) {
    const firstMessage = errors[0]?.message || "Validation failed";
    throw new ValidationError(errors, firstMessage);
  }
}
