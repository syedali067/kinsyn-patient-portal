<script setup lang="ts">
import CartEstimatesSkeleton from './components/CartEstimatesSkeleton.vue';
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
import { useCartStore } from '@/stores/cart';
import { storeToRefs } from 'pinia';

const cartStore = useCartStore();
const {
  updateCartLoading,
  formattedSubtotal,
  membershipAmount,
  formattedMembershipAmount,
  couponAmount,
  formattedCouponAmount,
  couponCode,
  formattedShipping,
  formattedShippingSubtotal,
  shippingDiscount,
  formattedTotal,
} = storeToRefs(cartStore);
</script>

<template>
  <CartEstimatesSkeleton
    v-if="updateCartLoading"
    :is-membership="membershipAmount > 0"
    :is-coupon="couponAmount > 0"
  />

  <div v-else data-testpl="cart-estimates">
    <div class="text-14 flex justify-between gap-12" data-testpl="cart-estimates-subtotal">
      <p data-testpl="cart-estimates-subtotal-label">
        {{ $t('subtotal') }}
      </p>
      <p data-testpl="cart-estimates-subtotal-value">
        {{ formattedSubtotal }}
      </p>
    </div>

    <div
      v-if="membershipAmount > 0"
      class="text-14 mt-24 flex justify-between gap-12"
      data-testpl="cart-estimates-membership"
    >
      <p data-testpl="cart-estimates-membership-label">
        {{ $t('membershipSavings') }}
      </p>
      <p data-testpl="cart-estimates-membership-value">
        {{ formattedMembershipAmount }}
      </p>
    </div>

    <div
      v-if="couponAmount > 0"
      class="text-14 mt-24 flex items-start justify-between gap-12"
      data-testpl="cart-estimates-discount"
    >
      <div class="overflow-hidden">
        <p data-testpl="cart-estimates-discount-label">{{ $t('discountCode') }}</p>
        <p
          class="text-12 text-secondary-text mt-4 truncate uppercase"
          data-testpl="cart-estimates-discount-code"
        >
          {{ couponCode }}
        </p>
        <p
          v-if="shippingDiscount > 0"
          class="text-12 text-secondary-text mt-4"
          data-testpl="cart-estimates-discount-shipping-note"
        >
          {{ $t('includesShippingDiscount') }}
        </p>
      </div>
      <p data-testpl="cart-estimates-discount-value">{{ formattedCouponAmount }}</p>
    </div>

    <div class="text-14 mt-24 flex justify-between gap-12" data-testpl="cart-estimates-shipping">
      <p data-testpl="cart-estimates-shipping-label">{{ $t('shipping') }}</p>

      <p class="flex gap-4" data-testpl="cart-estimates-shipping-value">
        <span data-testpl="cart-estimates-shipping-total">{{ formattedShipping }}</span>
        <span
          v-if="shippingDiscount > 0"
          class="text-disabled-text line-through"
          data-testpl="cart-estimates-shipping-subtotal"
        >
          {{ formattedShippingSubtotal }}
        </span>
      </p>
    </div>

    <BaseSeparator class="bg-bone mt-24" />

    <div
      class="text-18 mt-16 flex justify-between gap-12 font-medium"
      data-testpl="cart-estimates-total"
    >
      <p data-testpl="cart-estimates-total-label">{{ $t('total') }}</p>
      <p data-testpl="cart-estimates-total-value">{{ formattedTotal }}</p>
    </div>
  </div>
</template>
