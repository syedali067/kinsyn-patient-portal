import { apiHealth } from '@/api/health/apiHealth';
import { computedAsync } from '@vueuse/core';
import { computed, ref } from 'vue';

export const useBiomarkers = () => {
  const isQuestBiomarkersLoading = ref(false);
  const questBiomarkersResponse = computedAsync(
    () => apiHealth.getQuestBiomarkers(),
    null,
    isQuestBiomarkersLoading,
  );

  const questBiomarkers = computed(() => {
    return questBiomarkersResponse.value?.data.value?.data;
  });

  return {
    questBiomarkers,
    isQuestBiomarkersLoading,
  };
};
