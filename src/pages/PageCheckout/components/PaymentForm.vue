<script setup lang="ts">
import { useCheckout } from '../composables/useCheckout';
import { usePaymentForm } from '../composables/usePaymentForm';
import SvgApplePay from '@/assets/images/apple-pay.svg?component';
import SvgGooglePay from '@/assets/images/google-pay.svg?component';
import SvgPaypal from '@/assets/images/paypal.svg?component';
import imageVenmo from '@/assets/images/venmo.png';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseRadio from '@/components/BaseRadio/BaseRadio.vue';
import BaseRadioGroup from '@/components/BaseRadio/BaseRadioGroup.vue';
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
import BaseSpinner from '@/components/BaseSpinner/BaseSpinner.vue';
import CreditCardForm from '@/components/CreditCardForm/CreditCardForm.vue';
import CreditCardItem from '@/components/CreditCardItem/CreditCardItem.vue';
import ModalConfirm from '@/components/ModalConfirm/ModalConfirm.vue';
import { useChargebee } from '@/composables/useChargebee';
import { usePaymentMethods } from '@/composables/usePaymentMethods';
import type { PaymentMethod, PaymentMethodType } from '@/types/payment';
import { capitalize } from 'lodash-es';
import { ref, watch } from 'vue';

const { initWalletLoading, isApplePayCompatible, walletErrorMessage } = useCheckout();
const { paymentForm, isNewCard, paymentValidation } = usePaymentForm();

const {
  paymentMethods,
  deletePaymentMethodImmediately,
  defaultPaymentMethod,
  setPrimaryPaymentMethodImmediately,
} = usePaymentMethods();

const { isCardValid } = useChargebee();

const isDeleteModalOpen = ref(false);
const activePaymentMethod = ref<PaymentMethod['externalRef'] | null>(null);
const walletPaymentMethods: Omit<PaymentMethodType, 'CARD'>[] = [];

watch(isDeleteModalOpen, (isOpen) => {
  if (isOpen) return;
  activePaymentMethod.value = null;
});

watch(
  paymentMethods,
  (paymentMethods) => {
    isNewCard.value = paymentMethods.length === 0;
  },
  { immediate: true },
);
</script>

<template>
  <div>
    <ModalConfirm
      v-model="isDeleteModalOpen"
      :title="$t('removePaymentMethod')"
      :text="$t('areYouSureYouWantRemoveThisPaymentMethod')"
      :confirm-button-label="$t('remove')"
      @confirm="
        deletePaymentMethodImmediately(activePaymentMethod!);
        isDeleteModalOpen = false;
      "
    />

    <BaseRadioGroup
      as="form"
      class="mt-16 grid gap-16"
      v-model="paymentForm.paymentMethodType"
      :disabled="initWalletLoading"
      data-testpl="checkout-payment-radio-group"
    >
      <div
        class="rounded-8 overflow-hidden outline -outline-offset-1"
        :class="{
          'validation-error': !isCardValid,
          'outline-beige': paymentForm.paymentMethodType === 'CARD',
          'outline-stone': paymentForm.paymentMethodType !== 'CARD',
        }"
      >
        <BaseRadio value="CARD" class="w-full p-24" data-testpl="checkout-card-radio">
          <span class="flex flex-wrap items-center justify-between gap-x-24 gap-y-12">
            <span class="grow">
              {{
                isNewCard
                  ? $t('newCreditCard')
                  : capitalize(defaultPaymentMethod?.card.type) || $t('selectCard')
              }}

              <template v-if="defaultPaymentMethod && !isNewCard">
                (•••• •••• •••• {{ defaultPaymentMethod.card.ending }})
              </template>
            </span>
          </span>
        </BaseRadio>

        <!-- v-show for faster initialization of Chargebee form -->
        <div v-show="paymentForm.paymentMethodType === 'CARD'" class="px-24 pb-24">
          <div v-show="isNewCard">
            <CreditCardForm data-testpl="checkout-card-form" />

            <div v-if="paymentMethods.length !== 0" class="mt-16 flex gap-12">
              <BaseButton
                theme="outline"
                @click="isNewCard = false"
                data-testpl="checkout-card-form-cancel-button"
              >
                {{ $t('cancel') }}
              </BaseButton>
            </div>
          </div>

          <template v-if="!isNewCard">
            <ul v-if="paymentMethods.length !== 0">
              <li v-for="(method, index) in paymentMethods" :key="method.externalRef">
                <BaseSeparator v-if="index !== 0" class="bg-bone" />
                <div class="py-8">
                  <CreditCardItem
                    :method
                    @set-default="setPrimaryPaymentMethodImmediately(method.externalRef)"
                    @delete="
                      activePaymentMethod = method.externalRef;
                      isDeleteModalOpen = true;
                    "
                    data-testpl="checkout-card-item"
                  />
                </div>
              </li>
            </ul>

            <BaseButton
              class="mt-16"
              theme="outline"
              @click="isNewCard = true"
              data-testpl="checkout-add-new-card-button"
            >
              {{ $t('addNewCard') }}
            </BaseButton>
          </template>
        </div>
      </div>

      <template v-if="walletPaymentMethods.includes('APPLE_PAY')">
        <div
          class="rounded-8 overflow-hidden outline -outline-offset-1"
          :class="{
            'outline-beige': paymentForm.paymentMethodType === 'APPLE_PAY',
            'outline-stone': paymentForm.paymentMethodType !== 'APPLE_PAY',
          }"
        >
          <BaseRadio value="APPLE_PAY" class="w-full p-24" data-testpl="checkout-apple-pay-radio">
            <span class="flex flex-wrap items-center justify-between gap-x-24 gap-y-12">
              <span class="grow">Apple Pay</span>
              <SvgApplePay class="shrink-0" />
            </span>
          </BaseRadio>

          <template v-if="paymentForm.paymentMethodType === 'APPLE_PAY'">
            <div v-if="initWalletLoading" class="px-24 pb-24">
              <BaseSpinner class="mx-auto" />
            </div>

            <div v-else-if="!isApplePayCompatible" class="px-24 pb-24">
              <p class="text-error text-12">
                {{ $t('applePayIsNotSupported') }}
              </p>
            </div>

            <div v-else-if="walletErrorMessage" class="px-24 pb-24">
              <p class="text-error text-12">
                {{ walletErrorMessage }}
              </p>
            </div>
          </template>
        </div>
      </template>

      <template v-if="walletPaymentMethods.includes('GOOGLE_PAY')">
        <div
          class="rounded-8 overflow-hidden outline -outline-offset-1"
          :class="{
            'outline-beige': paymentForm.paymentMethodType === 'GOOGLE_PAY',
            'outline-stone': paymentForm.paymentMethodType !== 'GOOGLE_PAY',
          }"
        >
          <BaseRadio value="GOOGLE_PAY" class="w-full p-24" data-testpl="checkout-google-pay-radio">
            <span class="flex flex-wrap items-center justify-between gap-x-24 gap-y-12">
              <span class="grow">Google Pay</span>
              <SvgGooglePay class="shrink-0" />
            </span>
          </BaseRadio>

          <template v-if="paymentForm.paymentMethodType === 'GOOGLE_PAY'">
            <div v-if="initWalletLoading" class="px-24 pb-24">
              <BaseSpinner class="mx-auto" />
            </div>

            <div v-else-if="walletErrorMessage" class="px-24 pb-24">
              <p class="text-error text-12">
                {{ walletErrorMessage }}
              </p>
            </div>
          </template>
        </div>
      </template>

      <template v-if="walletPaymentMethods.includes('PAYPAL_EXPRESS_CHECKOUT')">
        <div
          class="rounded-8 overflow-hidden outline -outline-offset-1"
          :class="{
            'outline-beige': paymentForm.paymentMethodType === 'PAYPAL_EXPRESS_CHECKOUT',
            'outline-stone': paymentForm.paymentMethodType !== 'PAYPAL_EXPRESS_CHECKOUT',
          }"
        >
          <BaseRadio
            value="PAYPAL_EXPRESS_CHECKOUT"
            class="w-full p-24"
            data-testpl="checkout-paypal-radio"
          >
            <span class="flex flex-wrap items-center justify-between gap-x-24 gap-y-12">
              <span class="grow">Paypal</span>
              <SvgPaypal class="shrink-0" />
            </span>
          </BaseRadio>

          <template v-if="paymentForm.paymentMethodType === 'PAYPAL_EXPRESS_CHECKOUT'">
            <div v-if="initWalletLoading" class="px-24 pb-24">
              <BaseSpinner class="mx-auto" />
            </div>

            <div v-else-if="walletErrorMessage" class="px-24 pb-24">
              <p class="text-error text-12">
                {{ walletErrorMessage }}
              </p>
            </div>
          </template>
        </div>
      </template>

      <template v-if="walletPaymentMethods.includes('VENMO')">
        <div
          class="rounded-8 overflow-hidden outline -outline-offset-1"
          :class="{
            'outline-beige': paymentForm.paymentMethodType === 'VENMO',
            'outline-stone': paymentForm.paymentMethodType !== 'VENMO',
          }"
        >
          <BaseRadio value="VENMO" class="w-full p-24" data-testpl="checkout-venmo-radio">
            <span class="flex flex-wrap items-center justify-between gap-x-24 gap-y-12">
              <span class="grow">Venmo</span>
              <img class="w-40 shrink-0" :src="imageVenmo" alt="Venmo" />
            </span>
          </BaseRadio>

          <template v-if="paymentForm.paymentMethodType === 'VENMO'">
            <div v-if="initWalletLoading" class="px-24 pb-24">
              <BaseSpinner class="mx-auto" />
            </div>

            <div v-else-if="walletErrorMessage" class="px-24 pb-24">
              <p class="text-error text-12">
                {{ walletErrorMessage }}
              </p>
            </div>
          </template>
        </div>
      </template>
    </BaseRadioGroup>

    <p v-if="paymentValidation.$error" class="text-error text-12 mt-8">
      {{ paymentValidation.$errors[0]?.$message }}
    </p>
  </div>
</template>
