import { apiPharmacy } from '@/api/pharmacy';
import type { Pharmacy, PharmacyCategory, PharmacyProduct } from '@/types/pharmacy.ts';
import type { CategorySlug } from '@/types/treatment.ts';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

type PatientPharmacyCategorizedProducts = {
  [key in CategorySlug]?: {
    products: PharmacyProduct[];
    category: PharmacyCategory;
  };
};

export const usePharmacyStore = defineStore('pharmacy', () => {
  // main pharmacy
  const mainPharmacy = ref<Pharmacy>();
  const mainPharmacyCategories = computed(
    () =>
      mainPharmacy.value?.categories.filter((category) => category.handle !== 'membership') || [],
  );
  const mainPharmacyProducts = computed<PatientPharmacyCategorizedProducts>(() => {
    const results: PatientPharmacyCategorizedProducts = {};

    mainPharmacyCategories.value?.forEach((category) => {
      const slug = category.handle;
      const products = mainPharmacy.value?.products.filter(
        (product) => product.display && product.quizCategory?.slug === slug,
      );

      if (!slug || !products) {
        return;
      }

      results[slug] = {
        products,
        category,
      };
    });

    return results;
  });
  const getMainPharmacyLoading = ref(false);
  const getMainPharmacy = async () => {
    if (getMainPharmacyLoading.value) {
      return;
    }

    try {
      getMainPharmacyLoading.value = true;
      const { data } = await apiPharmacy.getPharmacy();

      mainPharmacy.value = data.value?.data;
    } finally {
      getMainPharmacyLoading.value = false;
    }
  };

  // popular pharmacy
  const popularPharmacy = ref<Pharmacy>();
  const popularPharmacyProducts = computed(
    () => popularPharmacy.value?.products?.filter((product) => product.display) || [],
  );
  const getPopularPharmacyLoading = ref(false);
  const getPopularPharmacy = async () => {
    if (getPopularPharmacyLoading.value) {
      return;
    }

    try {
      getPopularPharmacyLoading.value = true;

      const { data } = await apiPharmacy.getPharmacy({
        onlyPopular: 1,
      });

      popularPharmacy.value = data.value?.data;
    } finally {
      getPopularPharmacyLoading.value = false;
    }
  };

  // utils
  const getProductVariants = (id: PharmacyProduct['id']) =>
    mainPharmacy.value?.products.find((product) => product.id === id)?.variants || [];

  const getProductById = (id: PharmacyProduct['id']) =>
    mainPharmacy.value?.products.find((product) => product.id === id);

  return {
    mainPharmacy,
    getMainPharmacyLoading,
    getMainPharmacy,
    mainPharmacyCategories,
    mainPharmacyProducts,
    getPopularPharmacyLoading,
    getPopularPharmacy,
    popularPharmacyProducts,
    getProductById,
    getProductVariants,
  };
});
