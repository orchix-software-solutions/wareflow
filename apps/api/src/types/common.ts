import { z } from "zod";

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SortParams {
  sort: string;
  order: "asc" | "desc";
}

export interface ListQueryParams extends PaginationParams, Partial<SortParams> {
  search?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().optional(),
});
