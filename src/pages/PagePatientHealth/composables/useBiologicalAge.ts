import { apiHealth } from '@/api/health/apiHealth';
import { computedAsync } from '@vueuse/core';
import { computed, ref } from 'vue';

export const useBiologicalAge = () => {
  const isBiologicalAgeLoading = ref(false);
  const biologicalAgeResponse = computedAsync(
    () => apiHealth.getBiologicalAge(),
    null,
    isBiologicalAgeLoading,
  );

  const biologicalAge = computed(() => {
    return biologicalAgeResponse.value?.data.value?.data;
  });

  return {
    biologicalAge,
    isBiologicalAgeLoading,
  };
};
