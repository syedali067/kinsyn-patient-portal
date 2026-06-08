import { apiHealth } from '@/api/health/apiHealth';
import { computedAsync } from '@vueuse/core';
import { computed, ref } from 'vue';

export const useTrueDiagnostics = () => {
  const isTrueDiagnosticsLoading = ref(false);
  const trueDiagnosticsResponse = computedAsync(
    () => apiHealth.getTrueDiagnosticBiomarkers(),
    null,
    isTrueDiagnosticsLoading,
  );

  const trueDiagnostics = computed(() => {
    return trueDiagnosticsResponse.value?.data.value?.data;
  });

  return {
    trueDiagnostics,
    isTrueDiagnosticsLoading,
  };
};
