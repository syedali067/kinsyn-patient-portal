import type { Pagination, NewPagination } from './pagination';
import type { UseFetchReturn, UseMemoizeReturn } from '@vueuse/core';

export type MemoizeApiResponse<T> = UseMemoizeReturn<
  UseFetchReturn<Response<T>> & PromiseLike<UseFetchReturn<Response<T>>>,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  any
  /* eslint-enable @typescript-eslint/no-explicit-any */
>;

export interface Response<T> {
  message: string;
  status: string;
  data: T;
  pages?: Pagination;
  errors?: string[];
}

export interface NewResponse<T> {
  data: T;
  status: string;
  pagination?: NewPagination;
  errors?: string[];
}
