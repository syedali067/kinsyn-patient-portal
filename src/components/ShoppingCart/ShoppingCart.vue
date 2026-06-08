<script setup lang="ts">
import ShoppingCartItem from './components/ShoppingCartItem.vue';
import IconShoppingBag from '@/assets/icons/shopping-bag.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import BlockFiller from '@/components/BlockFiller/BlockFiller.vue';
import CartEstimates from '@/components/CartEstimates/CartEstimates.vue';
import { useShoppingCart } from '@/composables/useShoppingCart.ts';
import { useCartStore } from '@/stores/cart';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const isNotPharmacyRoute = computed(() => route.name !== 'PatientPharmacy');

const cartStore = useCartStore();
const { itemsCount, items, getCartLoading, updateCartLoading } = storeToRefs(cartStore);

const { isShoppingCartOpen, closeShoppingCart } = useShoppingCart();

const goToCheckout = () => {
  closeShoppingCart();

  router.push({ name: 'Checkout' });
};

const goToPharmacy = () => {
  closeShoppingCart();

  router.push({ name: 'PatientPharmacy' });
};
</script>

<template>
  <BaseDialog
    v-model:open="isShoppingCartOpen"
    position="right"
    class="max-w-424"
    data-testpl="shopping-cart-dialog"
  >
    <template #content>
      <template v-if="itemsCount">
        <div class="mb-32 flex items-center justify-between">
          <span class="text-26 font-secondary" data-testpl="shopping-cart-dialog-title">
            {{ $t('yourCart') }}
          </span>

          <span
            class="text-secondary-text text-12 uppercase"
            data-testpl="shopping-cart-dialog-items-count"
          >
            {{ itemsCount }} {{ $t('item', itemsCount) }}
          </span>
        </div>

        <div :key="items.map((item) => item.id).join('-')" data-testpl="shopping-cart-dialog-items">
          <template v-for="item in items">
            <ShoppingCartItem
              v-if="item.product"
              class="border-bone border-b-1 first:border-t-1"
              :item="item"
              :key="item.product.id"
              data-testpl="shopping-cart-dialog-item"
              :data-testpls="{
                image: 'shopping-cart-dialog-item-image',
                quizCategoryTitle: 'shopping-cart-dialog-item-quiz-category-title',
                title: 'shopping-cart-dialog-item-title',
                price: 'shopping-cart-dialog-item-price',
                variantTitle: 'shopping-cart-dialog-item-variant-title',
                ticker: 'shopping-cart-dialog-item-ticker',
                tickerDelete: 'shopping-cart-dialog-item-ticker-delete',
                tickerDecrement: 'shopping-cart-dialog-item-ticker-decrement',
                tickerIncrement: 'shopping-cart-dialog-item-ticker-increment',
                tickerInput: 'shopping-cart-dialog-item-ticker-input',
              }"
            />
          </template>
        </div>
      </template>

      <template v-else>
        <BlockFiller
          :icon="IconShoppingBag"
          :title="$t('yourCartIsEmpty')"
          :caption="$t('checkPharmacyToSeeTheTreatmentThatBestSuitsYou')"
          data-testpl="shopping-cart-dialog-filler"
        />
        <div v-if="isNotPharmacyRoute" class="flex justify-center">
          <BaseButton
            @click="goToPharmacy"
            theme="link"
            data-testpl="shopping-cart-dialog-pharmacy-btn"
          >
            {{ $t('goTo') }} {{ $t('pharmacy') }}
          </BaseButton>
        </div>
      </template>
    </template>

    <template #footer>
      <CartEstimates v-if="itemsCount > 0" />

      <BaseButton
        class="mt-24 w-full"
        :disabled="itemsCount === 0"
        :loading="getCartLoading || updateCartLoading"
        @click="goToCheckout"
        data-testpl="shopping-cart-dialog-checkout-btn"
      >
        {{ $t('goTo') }} {{ $t('checkout') }}
      </BaseButton>
    </template>
  </BaseDialog>
</template>
