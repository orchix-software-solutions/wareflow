import type { PaginationMeta } from "./pagination";

export interface ApiSuccess<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  error?: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
