import { apiIntegrations } from '@/api/integrations/mammoth';
import { computedAsync } from '@vueuse/core';
import { computed, ref } from 'vue';

export const useMammothFields = () => {
  const isMammothFieldsLoading = ref(false);
  const getMammothFieldsResponse = computedAsync(
    () => apiIntegrations.getMammothFields(),
    null,
    isMammothFieldsLoading,
  );

  const mammothFields = computed(() => {
    return getMammothFieldsResponse.value?.data.value?.data;
  });

  return {
    mammothFields,
    isMammothFieldsLoading,
  };
};
