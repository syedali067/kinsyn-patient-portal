import { apiAiSettings } from '@/api/ai-settings';
import type { AiSettings } from '@/api/ai-settings/types.ts';
import { useToastStore } from '@/stores/toast';
import { ref } from 'vue';

export const useAiSettings = () => {
  const toastStore = useToastStore();

  const aiSettingsEnabled = ref(true);
  const aiSettingsLoading = ref(false);
  const updateAiSettingsLoading = ref(false);

  const getAiSettings = async () => {
    try {
      aiSettingsLoading.value = true;
      const response = await apiAiSettings.getSettings();

      if (response.statusCode.value !== 200) {
        return;
      }

      aiSettingsEnabled.value = !!response.data.value?.data?.settings.enable_ai_companion.value;
    } finally {
      aiSettingsLoading.value = false;
    }
  };

  const updateSettings = async (payload: AiSettings) => {
    try {
      updateAiSettingsLoading.value = true;

      const response = await apiAiSettings.updateAiSettings(payload);

      if (response.statusCode.value !== 200) {
        return;
      }

      toastStore.addToast({
        type: 'success',
        text: response.data.value?.message,
      });
      await apiAiSettings.getSettings.load();
      return response.data.value?.data;
    } finally {
      updateAiSettingsLoading.value = false;
    }
  };

  return {
    updateSettings,
    aiSettingsEnabled,
    getAiSettings,
    aiSettingsLoading,
  };
};
