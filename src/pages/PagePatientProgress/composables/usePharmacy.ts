import { apiPharmacy } from '@/api/pharmacy';
import type { ProductItemData } from '@/components/ProductItem/types.ts';
import { startingAtFromVariants } from '@/utils/formatters';
import { computedAsync } from '@vueuse/core';
import { computed } from 'vue';

export const usePharmacy = () => {
  const getPharmacyResponse = computedAsync(() => apiPharmacy.getPharmacy(), null);

  const pharmacy = computed(() => {
    return getPharmacyResponse.value?.data.value?.data;
  });

  const weightLossProducts = computed<ProductItemData[]>(() => {
    if (!pharmacy.value) return [];

    return pharmacy.value.products
      .filter((item) => item.quizCategory?.slug === 'weight-management')
      .map((product) => {
        const priceInfo = startingAtFromVariants(product.variants);
        const price = priceInfo?.startingAt ?? priceInfo?.amount ?? '0';

        return {
          id: product.id,
          category: product.quizCategory?.slug ?? '',
          name: product.title,
          description: product.description ?? '',
          price,
          image: product.image?.url ?? '',
          link: product.url,
          rxOnly: product.rxOnly,
        };
      });
  });

  return {
    pharmacy,
    weightLossProducts,
  };
};
