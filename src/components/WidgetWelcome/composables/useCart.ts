import { apiCart } from '@/api/cart';
import { computedAsync } from '@vueuse/core';
import { computed } from 'vue';

export const useCart = () => {
  const getCartResponse = computedAsync(() => apiCart.getCart(), null);
  const cartItemsCount = computed(() => getCartResponse.value?.data.value?.data.items.length);

  return {
    cartItemsCount,
  };
};
