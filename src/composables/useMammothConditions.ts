import { apiIntegrations } from '@/api/integrations/mammoth/apiIntegrations';
import { computedAsync } from '@vueuse/core';
import { ref, computed } from 'vue';

export const useMammothConditions = () => {
  const isMammothConditionsLoading = ref(false);
  const getMammothConditionsResponse = computedAsync(
    () => apiIntegrations.getMammothConditions(),
    null,
    isMammothConditionsLoading,
  );

  const mammothData = computed(() => {
    if (
      Array.isArray(getMammothConditionsResponse.value?.data.value?.data) &&
      getMammothConditionsResponse.value?.data.value?.data.length === 0
    ) {
      return undefined;
    }

    return getMammothConditionsResponse.value?.data.value?.data;
  });

  return {
    mammothData,
    isMammothConditionsLoading,
    getMammothConditionsResponse,
  };
};
