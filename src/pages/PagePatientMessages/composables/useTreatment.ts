import { apiTreatment } from '@/api/treatment';
import { useUserStore } from '@/stores/user';
import { computedAsync } from '@vueuse/core';
import { computed } from 'vue';

const userStore = useUserStore();

export const useTreatment = () => {
  /* if this information was stored with the user, then there would be no need to send such a difficult request */
  const getTreatments = computedAsync(
    () => apiTreatment.getTreatments({ patientId: userStore.userId as number }),
    null,
  );

  const treatments = computed(() => getTreatments.value?.data.value?.data || []);

  return {
    treatments,
  };
};
