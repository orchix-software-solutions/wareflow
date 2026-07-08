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
