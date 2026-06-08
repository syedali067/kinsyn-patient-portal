export interface Pagination {
  totalCount: number;
  defaultPageSize: number;
}

export interface PaginationPayload {
  page?: number;
  perPage?: number;
}

export interface NewPagination {
  total: number;
  page: number;
  limit: number;
}

export interface NewPaginationPayload {
  page?: number;
  limit?: number;
}
