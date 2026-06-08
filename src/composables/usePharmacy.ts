import { apiPharmacy } from '@/api/pharmacy';
import { computedAsync } from '@vueuse/core';
import { computed } from 'vue';

export const usePharmacy = () => {
  const getPharmacyResponse = computedAsync(() => apiPharmacy.getPharmacy(), null);

  const pharmacy = computed(() => getPharmacyResponse.value?.data.value?.data);
  const pharmacyCategories = computed(
    () => pharmacy.value?.categories.filter((category) => category.handle !== 'membership') ?? [],
  );

  return {
    pharmacy,
    pharmacyCategories,
  };
};
