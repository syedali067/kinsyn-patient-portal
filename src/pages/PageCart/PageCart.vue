<script setup lang="ts">
import IconArrowLeft from '@/assets/icons/arrow-left.svg?component';
import IconShoppingBag from '@/assets/icons/shopping-bag.svg?component';
import SvgAmex from '@/assets/images/amex.svg?component';
import SvgApplePay from '@/assets/images/apple-pay.svg?component';
import SvgGooglePay from '@/assets/images/google-pay.svg?component';
import SvgMaestro from '@/assets/images/maestro.svg?component';
import SvgMasterCard from '@/assets/images/mastercard.svg?component';
import SvgVisa from '@/assets/images/visa.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BlockFiller from '@/components/BlockFiller/BlockFiller.vue';
import CartEstimates from '@/components/CartEstimates/CartEstimates.vue';
import ProductCarousel from '@/components/ProductCarousel/ProductCarousel.vue';
import ShoppingCartItem from '@/components/ShoppingCart/components/ShoppingCartItem.vue';
import { useRouterBack } from '@/composables/useRouterBack';
import { useCartStore } from '@/stores/cart';
import { usePharmacyStore } from '@/stores/pharmacy';
import { useUserStore } from '@/stores/user';
import { waitTransition } from '@/utils/pageTransition.ts';
import { productMapper } from '@/utils/pharmacyMappers.ts';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { Teleport } from 'vue';

const { goBack } = useRouterBack();
const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const cartStore = useCartStore();
const { items, itemsCount } = storeToRefs(cartStore);
const { getCart } = cartStore;

const pharmacyStore = usePharmacyStore();
const { popularPharmacyProducts } = storeToRefs(pharmacyStore);
const { getPopularPharmacy } = pharmacyStore;

const userStore = useUserStore();
const { isGuest } = storeToRefs(userStore);

await Promise.all([waitTransition(), getCart(), getPopularPharmacy()]);
</script>

<template>
  <div class="flex flex-col gap-40 lg:gap-56" data-page-in="fadeInUp" data-page-out="fadeOutUp">
    <div v-if="!greaterOrEqualLg" class="-mb-16 flex items-center gap-16">
      <BaseButton color="light" size="40" rounded @click="goBack">
        <template #prepend>
          <IconArrowLeft class="size-20" />
        </template>
      </BaseButton>

      <button class="text-14" @click="goBack">
        {{ $t('goBack') }}
      </button>
    </div>

    <div class="row gap-y-24" data-testpl="patient-cart-page">
      <section v-if="!itemsCount" class="rounded-8 col-span-full bg-white p-24 pb-75 max-lg:px-16">
        <h1
          class="text-21 lg:text-26 font-secondary mb-46 lg:mb-18"
          data-testpl="patient-cart-page-title"
        >
          {{ $t('yourCart') }}
        </h1>

        <BlockFiller
          v-if="isGuest"
          :icon="IconShoppingBag"
          :title="$t('yourCartIsEmpty')"
          :caption="$t('checkHomeToSeeTheTreatmentThatBestSuitsYouForGuest')"
          :button-label="$t('goToHome')"
          :to="{ path: '/' }"
          data-testpl="patient-cart-page-filler"
        />

        <BlockFiller
          v-else
          :icon="IconShoppingBag"
          :title="$t('yourCartIsEmpty')"
          :caption="$t('checkPharmacyToSeeTheTreatmentThatBestSuitsYou')"
          :button-label="`${$t('goTo')} ${$t('pharmacy')}`"
          :to="{ name: 'PatientPharmacy' }"
          data-testpl="patient-cart-page-filler"
        />
      </section>

      <template v-else>
        <div class="rounded-8 col-span-full grow bg-white p-24 lg:col-span-8">
          <div class="mb-24 flex items-center gap-16">
            <h1 class="text-26 font-secondary grow truncate" data-testpl="patient-cart-page-title">
              {{ $t('yourCart') }}
            </h1>

            <span
              class="text-12 text-secondary-text font-medium uppercase"
              data-testpl="patient-cart-page-items-count"
            >
              {{ itemsCount }} {{ $t('item', itemsCount) }}
            </span>
          </div>

          <ShoppingCartItem
            v-for="item in items"
            class="border-bone border-t"
            :key="item.id"
            :item="item"
            image-size="96"
            is-category-showed
            data-testpl="patient-cart-page-item"
            :data-testpls="{
              image: 'patient-cart-page-item-image',
              quizCategoryTitle: 'patient-cart-page-item-quiz-category-title',
              title: 'patient-cart-page-item-title',
              price: 'patient-cart-page-item-price',
              variantTitle: 'patient-cart-page-item-variant-title',
              ticker: 'patient-cart-page-item-ticker',
              tickerDelete: 'patient-cart-page-item-ticker-delete',
              tickerDecrement: 'patient-cart-page-item-ticker-decrement',
              tickerIncrement: 'patient-cart-page-item-ticker-increment',
              tickerInput: 'patient-cart-page-item-ticker-input',
            }"
          />
        </div>

        <div
          class="rounded-8 col-span-full flex flex-col gap-24 bg-white p-24 lg:col-span-4"
          data-testpl="patient-cart-page-summary"
        >
          <h1 class="text-26 font-secondary truncate" data-testpl="patient-cart-page-summary-title">
            {{ $t('summary') }}
          </h1>

          <CartEstimates />

          <component :is="greaterOrEqualLg ? 'div' : Teleport" to="body">
            <div
              :class="{
                'fixed bottom-0 left-0 z-10 w-full bg-white px-16 py-24': !greaterOrEqualLg,
              }"
            >
              <BaseButton
                class="w-full"
                :disabled="!itemsCount"
                :to="{ name: 'Checkout' }"
                data-testpl="patient-cart-page-summary-checkout-btn"
              >
                {{ $t('checkout') }}

                <span v-if="itemsCount"> ({{ itemsCount }} {{ $t('item', itemsCount) }}) </span>

                <template #prepend>
                  <IconShoppingBag class="size-20" />
                </template>
              </BaseButton>
            </div>
          </component>

          <div
            class="flex justify-center gap-8"
            data-testpl="patient-cart-page-summary-payment-methods"
          >
            <SvgMasterCard />
            <SvgVisa />
            <SvgAmex />
            <SvgMaestro />
            <SvgGooglePay />
            <SvgApplePay />
          </div>
        </div>
      </template>
    </div>

    <div class="row mb-80 lg:mb-auto">
      <div v-if="popularPharmacyProducts.length > 0" class="col-span-full flex flex-col gap-24">
        <h3
          class="text-26 font-secondary"
          data-testpl="patient-cart-page-summary-popular-products-title"
        >
          {{ $t('popular') }}
        </h3>

        <ProductCarousel
          class="-mr-16 lg:-mr-24"
          :products="popularPharmacyProducts.map(productMapper)"
          data-testpl="patient-cart-page-summary-popular-products"
        />
      </div>
    </div>
  </div>
</template>
