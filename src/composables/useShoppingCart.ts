import { createSharedComposable } from '@vueuse/core';
import { ref } from 'vue';

export const useShoppingCart = createSharedComposable(() => {
  const isShoppingCartOpen = ref(false);

  const openShoppingCart = () => {
    isShoppingCartOpen.value = true;
  };

  const closeShoppingCart = () => {
    isShoppingCartOpen.value = false;
  };

  const toggleShoppingCart = () => {
    isShoppingCartOpen.value = !isShoppingCartOpen.value;
  };

  return {
    isShoppingCartOpen,
    openShoppingCart,
    closeShoppingCart,
    toggleShoppingCart,
  };
});
