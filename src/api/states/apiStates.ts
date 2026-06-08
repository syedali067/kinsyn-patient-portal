import type { State } from '@/api/states/types.ts';
import { useApi } from '@/composables/useApi';
import type { Response } from '@/types/response';
import { useMemoize } from '@vueuse/core';

const getStates = useMemoize(() => {
  return useApi<Response<State[]>>('/api/v1/states').get();
});

export const apiStates = {
  getStates,
};
