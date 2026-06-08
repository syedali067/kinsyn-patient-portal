import { apiIntegrations } from '@/api/integrations/mammoth';
import type { MammothRegistrationPayload } from '@/api/integrations/mammoth/types';
import { useToastStore } from '@/stores/toast';
import { ref } from 'vue';

export const useMammothRegistration = () => {
  const toastStore = useToastStore();

  const isMammothLoading = ref(false);
  const mammothRegistration = async (payload: MammothRegistrationPayload): Promise<boolean> => {
    isMammothLoading.value = true;
    try {
      const response = await apiIntegrations.mammothRegistration(payload);

      if (response.statusCode.value !== 200) {
        return false;
      }

      toastStore.addToast({
        type: 'success',
        text: response.data.value?.message,
      });

      return true;
    } finally {
      isMammothLoading.value = false;
    }
  };

  return {
    isMammothLoading,
    mammothRegistration,
  };
};
