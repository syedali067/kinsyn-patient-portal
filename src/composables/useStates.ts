import { apiStates } from '@/api/states';
import type { BaseSelectOption } from '@/components/BaseSelect/types.ts';
import { computedAsync } from '@vueuse/core';
import { computed } from 'vue';

export const useStates = () => {
  const getStatesResponse = computedAsync(() => apiStates.getStates(), null);

  const states = computed(() => {
    return getStatesResponse.value?.data.value?.data as BaseSelectOption[] | undefined;
  });

  return {
    states,
  };
};
