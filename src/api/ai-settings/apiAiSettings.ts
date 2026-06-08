import type { AiSettings, AiSettingsResponse } from './types';
import { useApi } from '@/composables/useApi';
import type { Response } from '@/types/response';
import { useMemoize } from '@vueuse/core';

const getSettings = useMemoize(() => {
  return useApi<Response<AiSettingsResponse>>('/api/v3/patient/ai-settings').get();
});

const updateAiSettings = (payload?: AiSettings) => {
  return useApi<Response<AiSettings>>('/api/v3/patient/ai-settings').post(payload);
};

export const apiAiSettings = {
  getSettings,
  updateAiSettings,
};
