export type EntityId = string;

export type StatusTone = "default" | "success" | "warning" | "destructive" | "info";

export type SortDirection = "asc" | "desc";

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TableQueryState {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDir?: SortDirection;
  search?: string;
}
