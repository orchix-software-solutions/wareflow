import { HTTP_STATUS } from "./http-status";
import type { PaginationMeta } from "@/types/common";

interface ApiResponseShape<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

const DEFAULT_MESSAGES: Record<number, string> = {
  [HTTP_STATUS.OK]: "Success",
  [HTTP_STATUS.CREATED]: "Created",
  [HTTP_STATUS.NO_CONTENT]: "No content",
};

export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data: T;
  public readonly meta?: PaginationMeta;

  private constructor(statusCode: number, data: T, message?: string, meta?: PaginationMeta) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message ?? DEFAULT_MESSAGES[statusCode] ?? "Success";
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
  }

  static ok<T>(data: T, message?: string): ApiResponse<T> {
    return new ApiResponse(HTTP_STATUS.OK, data, message);
  }

  static created<T>(data: T, message?: string): ApiResponse<T> {
    return new ApiResponse(HTTP_STATUS.CREATED, data, message);
  }

  static noContent(): ApiResponse<null> {
    return new ApiResponse(HTTP_STATUS.NO_CONTENT, null);
  }

  static paginated<T>(data: T[], meta: PaginationMeta, message?: string): ApiResponse<T[]> {
    return new ApiResponse(HTTP_STATUS.OK, data, message, meta);
  }

  toJSON(): ApiResponseShape<T> {
    const json: ApiResponseShape<T> = {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
    };
    if (this.meta) {
      json.meta = this.meta;
    }
    return json;
  }
}
