<script setup lang="ts">
import AddressForm from './components/AddressForm.vue';
import CartItem from './components/CartItem.vue';
import ConsentForm from './components/ConsentForm.vue';
import CouponForm from './components/CouponForm.vue';
import LoginForm from './components/LoginForm.vue';
import PaymentForm from './components/PaymentForm.vue';
import PhoneForm from './components/PhoneForm.vue';
import RegistrationForm from './components/RegistrationForm.vue';
import { useAddressForm } from './composables/useAddressForm';
import { useCheckout } from './composables/useCheckout';
import { usePaymentForm } from './composables/usePaymentForm';
import { usePhoneForm } from './composables/usePhoneForm';
import { apiAnalytics } from '@/api/analytics';
import { apiStates } from '@/api/states';
import IconRx from '@/assets/icons/rx.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseRadio from '@/components/BaseRadio/BaseRadio.vue';
import BaseRadioGroup from '@/components/BaseRadio/BaseRadioGroup.vue';
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
import CartEstimates from '@/components/CartEstimates/CartEstimates.vue';
import { usePaymentMethods } from '@/composables/usePaymentMethods';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import type { WalletPaymentMethodType } from '@/types/payment';
import { waitTransition } from '@/utils/pageTransition';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const userStore = useUserStore();
const { isGuest } = storeToRefs(userStore);

const { buy, buyLoading, initWalletLoading, enabledWalletPaymentMethods } = useCheckout();

const {
  isBillingAddressSame,
  shippingAddressForm,
  shippingAddressValidation,
  billingAddressForm,
  billingAddressValidation,
  shippingAddressFormComponent,
  billingAddressFormComponent,
} = useAddressForm();

const { phoneValidation, consentForm } = usePhoneForm();
const { paymentForm, paymentValidation } = usePaymentForm();
const { getPaymentMethods } = usePaymentMethods();

const cartStore = useCartStore();

const {
  cart,
  itemsCount,
  hasRxProduct,
  addCouponLoading,
  addCouponError,
  removeCouponLoading,
  couponCode,
} = storeToRefs(cartStore);

const { getCart, addCoupon, removeCoupon } = cartStore;

await Promise.all([
  waitTransition(),
  apiStates.getStates(),
  isGuest.value ? Promise.resolve() : getPaymentMethods(),
  getCart(),
]);

if (cart.value?.id) {
  apiAnalytics.trackCheckoutStarted({ cartId: cart.value.id });
}

watch(
  itemsCount,
  (itemsCount) => {
    if (itemsCount > 0) {
      return;
    }
    router.push({ name: 'Cart' });
  },
  { immediate: true },
);

const authType = ref<'login' | 'registration'>('login');
</script>

<template>
  <div class="row grow items-start gap-y-56" data-page-in="fadeInUp" data-page-out="fadeOutUp">
    <div class="col-span-full">
      <h1 class="text-21 lg:text-26 text-secondary">{{ $t('checkout') }}</h1>
    </div>

    <div v-if="isGuest" class="col-span-full lg:col-span-5">
      <LoginForm v-if="authType === 'login'" @register="authType = 'registration'" />
      <RegistrationForm v-else-if="authType === 'registration'" @login="authType = 'login'" />
    </div>

    <div v-else class="col-span-full flex flex-col gap-56 lg:col-span-6">
      <section
        :class="{
          'validation-error': shippingAddressValidation.$error,
        }"
      >
        <h2>{{ $t('shippingAddress') }}</h2>

        <AddressForm
          ref="shippingAddressFormComponent"
          class="mt-16"
          v-model="shippingAddressForm"
          :validation="shippingAddressValidation"
          data-testpl="checkout-shipping-form"
        />
      </section>

      <section
        :class="{
          'validation-error': phoneValidation.$error,
        }"
      >
        <h2>{{ $t('phoneNumber') }}</h2>

        <PhoneForm
          class="mt-16"
          v-model:phone="shippingAddressForm.phone"
          v-model:consent="consentForm"
          :phone-validation
          data-testpl="checkout-phone-form"
        />
      </section>

      <section
        :class="{
          'validation-error': paymentValidation.$error,
        }"
      >
        <h2>{{ $t('paymentOptions') }}</h2>

        <p class="text-14 text-secondary-text mt-8">
          {{ $t('allTransactionsAreSecureAndEncrypted') }}
        </p>

        <PaymentForm />
      </section>

      <section>
        <h2>{{ $t('billingAddress') }}</h2>

        <BaseRadioGroup
          as="form"
          class="mt-16 grid gap-16"
          :model-value="Number(isBillingAddressSame)"
          @update:model-value="(value) => (isBillingAddressSame = !!value)"
          data-testpl="checkout-shipping-radio-group"
        >
          <BaseRadio
            :value="1"
            class="rounded-8 border p-24"
            :class="{
              'border-beige': isBillingAddressSame,
              'border-stone': !isBillingAddressSame,
            }"
            data-testpl="checkout-same-as-shipping-radio"
          >
            {{ $t('sameAsShippingAddress') }}
          </BaseRadio>

          <BaseRadio
            :value="0"
            class="rounded-8 border p-24"
            :class="{
              'border-beige': !isBillingAddressSame,
              'border-stone': isBillingAddressSame,
            }"
            data-testpl="checkout-use-different-billing-radio"
          >
            {{ $t('useADifferentBillingAddress') }}
          </BaseRadio>
        </BaseRadioGroup>

        <AddressForm
          v-if="!isBillingAddressSame"
          ref="billingAddressFormComponent"
          class="mt-16"
          :class="{
            'validation-error': billingAddressValidation.$error,
          }"
          v-model="billingAddressForm"
          :validation="billingAddressValidation"
          data-testpl="checkout-billing-form"
        />
      </section>
    </div>

    <section
      class="col-span-full lg:sticky lg:top-112 lg:col-span-5 lg:col-start-8"
      data-testpl="checkout-order"
    >
      <h2 data-testpl="checkout-order-title">{{ $t('orderSummary') }}</h2>

      <ul v-if="cart?.items.length" class="mt-16 grid gap-24" data-testpl="checkout-order-list">
        <li v-for="item in cart.items" :key="item.id" data-testpl="checkout-order-item">
          <CartItem :item />
        </li>
      </ul>

      <BaseSeparator class="bg-bone mt-24" />

      <div class="mt-24">
        <CouponForm
          :value="couponCode"
          :loading="addCouponLoading || removeCouponLoading"
          v-model:error="addCouponError"
          @add="addCoupon"
          @remove="removeCoupon"
        />
      </div>

      <BaseSeparator class="bg-bone mt-24" />

      <CartEstimates class="mt-24" />

      <div
        v-if="hasRxProduct"
        class="mt-24 flex items-center gap-8"
        data-testpl="checkout-order-rx"
      >
        <IconRx class="text-beige shrink-0 self-start" />

        <p class="text-14 text-secondary-text">
          {{ $t('youLlOnlyBeChargedForPrescriptionTreatment') }}
        </p>
      </div>
    </section>

    <template v-if="!isGuest">
      <section class="col-span-full grid gap-16 lg:col-span-6 lg:grid-cols-2">
        <BaseButton theme="outline" :to="{ name: 'Cart' }" data-testpl="checkout-go-back-button">
          {{ $t('goBack') }}
        </BaseButton>

        <template v-for="method in enabledWalletPaymentMethods" :key="method">
          <template v-if="method === paymentForm.paymentMethodType">
            <div
              class="[&_*]:!w-full"
              id="wallet-button"
              v-show="!initWalletLoading && !buyLoading"
            />
            <BaseButton v-if="initWalletLoading || buyLoading" loading>
              {{ $t('loading') }}
            </BaseButton>
          </template>
        </template>

        <BaseButton
          v-if="
            !enabledWalletPaymentMethods.includes(
              paymentForm.paymentMethodType as WalletPaymentMethodType,
            )
          "
          @click="buy"
          :loading="buyLoading"
          data-testpl="checkout-buy-button"
        >
          {{ $t('purchase') }}
        </BaseButton>
      </section>

      <section class="col-span-full lg:col-span-6 lg:col-start-1">
        <ConsentForm />
      </section>
    </template>
  </div>
</template>
