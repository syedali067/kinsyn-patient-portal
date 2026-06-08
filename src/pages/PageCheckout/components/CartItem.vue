<script setup lang="ts">
import type { CartItem } from '@/types/cart';
import { formatPrice } from '@/utils/formatters';

defineProps<{
  item: CartItem;
}>();
</script>

<template>
  <div class="grid grid-cols-[80px_1fr] items-center gap-16" data-testpl="cart-item">
    <figure class="bg-sand/20 rounded-4 h-100 overflow-hidden" data-testpl="cart-item-image">
      <img
        v-if="item.product?.image?.url"
        class="h-full w-full object-contain"
        :src="item.product.image.url"
        :alt="item.product.title"
      />
    </figure>

    <div>
      <p
        v-if="item.product?.quizCategory.title"
        class="text-beige text-10 font-medium uppercase"
        data-testpl="cart-item-quiz-category-title"
      >
        {{ item.product.quizCategory.title }}
      </p>

      <p v-if="item.product?.title" class="not-first:mt-4" data-testpl="cart-item-title">
        {{ item.product.title }}
      </p>

      <p class="flex gap-4 not-first:mt-16">
        <span data-testpl="cart-item-total">{{ formatPrice(item.total) }}</span>

        <span
          v-if="item.discount > 0"
          class="text-disabled-text line-through"
          data-testpl="cart-item-subtotal"
        >
          {{ formatPrice(item.subtotal) }}
        </span>
      </p>

      <p
        v-if="item.variant?.variantPeriod && item.variant.variantPeriodUnit"
        class="text-12 text-secondary-text not-first:mt-4"
        data-testpl="cart-item-variant"
      >
        {{ item.variant.variantPeriod }} {{ item.variant.variantPeriodUnit }} supply
      </p>
    </div>
  </div>
</template>
