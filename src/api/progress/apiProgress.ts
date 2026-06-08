import type { WeightProgressPayload } from './types';
import { useApi, stringifyQuery } from '@/composables/useApi';
import type { PaginationPayload } from '@/types/pagination';
import type { ProgressCard, WeightProgress } from '@/types/progress';
import type { Response } from '@/types/response';
import { useMemoize } from '@vueuse/core';

const getAllProgress = useMemoize((payload: PaginationPayload) => {
  const params = stringifyQuery({ ...payload });
  /* to have only image we use v2 */
  return useApi<Response<ProgressCard[]>>(`/api/v1/user-progress/?${params}`).get();
});

const getWeightProgress = useMemoize((payload: PaginationPayload) => {
  const params = stringifyQuery({ ...payload });
  return useApi<Response<WeightProgress>>(`/api/v2/user-progress-filtered/?${params}`).get();
});

const createWeightProgress = (payload: WeightProgressPayload) => {
  return useApi<Response<ProgressCard>>('/api/v2/create-user-progress').post(payload);
};

const createImageProgress = (payload: FormData) => {
  return useApi<Response<ProgressCard>>('/api/v2/create-user-progress').post(payload);
};

const updateWeightProgress = (payload: WeightProgressPayload, progressId: number) => {
  return useApi<Response<ProgressCard>>(`/api/v1/update-user-progress/${progressId}`).post(payload);
};

const deleteProgress = (progressId: number) => {
  return useApi<Response<ProgressCard[]>>(`/api/v2/delete-user-progress/${progressId}`).delete();
};

export const apiProgress = {
  getAllProgress,
  getWeightProgress,
  createWeightProgress,
  createImageProgress,
  updateWeightProgress,
  deleteProgress,
};
