<script lang="ts" setup>
import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import IconShoppingBag from '@/assets/icons/shopping-bag.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseCounter from '@/components/BaseCounter/BaseCounter.vue';
import { useShoppingCart } from '@/composables/useShoppingCart';
import { useCartStore } from '@/stores/cart';
import { storeToRefs } from 'pinia';

const { openShoppingCart } = useShoppingCart();
const cartStore = useCartStore();
const { itemsCount } = storeToRefs(cartStore);
</script>

<template>
  <Teleport to="body">
    <BaseButton
      v-if="itemsCount"
      class="fixed bottom-40 left-1/2 z-1 -translate-x-1/2 shadow-sm"
      color="light"
      data-testpl="go-to-cart-button"
      @click="openShoppingCart"
    >
      <template #prepend>
        <div class="relative">
          <IconShoppingBag />

          <BaseCounter
            :model-value="itemsCount"
            class="absolute -top-1/4 -right-1/4 z-1"
            size="16"
          />
        </div>
      </template>

      <span class="px-12 whitespace-nowrap">{{ $t('goTo') }} {{ $t('cart') }}</span>

      <template #append>
        <IconArrowRight class="size-20" />
      </template>
    </BaseButton>
  </Teleport>
</template>
