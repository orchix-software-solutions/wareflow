import { HTTP_STATUS, type HttpStatusCode } from "./http-status";

export class ApiError extends Error {
  public readonly success = false;
  public readonly statusCode: HttpStatusCode;
  public readonly code: string;
  public readonly errors: unknown[];
  public readonly isOperational: boolean;

  constructor(
    statusCode: HttpStatusCode,
    message: string,
    code: string,
    options?: { errors?: unknown[]; isOperational?: boolean },
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = options?.errors ?? [];
    this.isOperational = options?.isOperational ?? true;
    Error.captureStackTrace(this, this.constructor);
  }

  /** Serializes the error for the HTTP response (no stack trace). */
  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      code: this.code,
      errors: this.errors,
    };
  }
}

export class ValidationError extends ApiError {
  constructor(errors: unknown[], message = "Validation failed") {
    super(HTTP_STATUS.BAD_REQUEST, message, "VALIDATION_ERROR", { errors });
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad request") {
    super(HTTP_STATUS.BAD_REQUEST, message, "BAD_REQUEST");
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = "Authentication required") {
    super(HTTP_STATUS.UNAUTHORIZED, message, "AUTHENTICATION_ERROR");
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Access denied") {
    super(HTTP_STATUS.FORBIDDEN, message, "FORBIDDEN");
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string, identifier?: string) {
    const message = identifier ? `${resource} not found: ${identifier}` : `${resource} not found`;
    super(HTTP_STATUS.NOT_FOUND, message, "NOT_FOUND");
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Resource conflict") {
    super(HTTP_STATUS.CONFLICT, message, "CONFLICT");
  }
}

export class UnprocessableError extends ApiError {
  constructor(message = "Unprocessable entity", errors: unknown[] = []) {
    super(HTTP_STATUS.UNPROCESSABLE_ENTITY, message, "UNPROCESSABLE_ENTITY", {
      errors,
    });
  }
}

export class RateLimitError extends ApiError {
  public readonly retryAfterSeconds?: number;

  constructor(retryAfterSeconds?: number) {
    super(HTTP_STATUS.TOO_MANY_REQUESTS, "Too many requests", "RATE_LIMITED");
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class InternalError extends ApiError {
  constructor(message = "Internal server error") {
    super(HTTP_STATUS.INTERNAL_SERVER_ERROR, message, "INTERNAL_ERROR", {
      isOperational: false,
    });
  }
}

export class ServiceUnavailableError extends ApiError {
  constructor(message = "Service unavailable") {
    super(HTTP_STATUS.SERVICE_UNAVAILABLE, message, "SERVICE_UNAVAILABLE");
  }
}
