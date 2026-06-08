<script setup lang="ts">
import IconNoPayment from '@/assets/icons/no-payment.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
import CreditCardForm from '@/components/CreditCardForm/CreditCardForm.vue';
import CreditCardItem from '@/components/CreditCardItem/CreditCardItem.vue';
import ModalConfirm from '@/components/ModalConfirm/ModalConfirm.vue';
import { useChargebee } from '@/composables/useChargebee.ts';
import { usePaymentMethods } from '@/composables/usePaymentMethods.ts';
import { useToastStore } from '@/stores/toast';
import type { PaymentMethod } from '@/types/payment.ts';
import { breakpointsTailwind, useBreakpoints, useTimeoutFn } from '@vueuse/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const {
  paymentMethods,
  getPaymentMethods,
  setPrimaryPaymentMethodImmediately,
  deletePaymentMethodImmediately,
  createPaymentMethod,
} = usePaymentMethods();

const { cardComponent } = useChargebee();

const toastStore = useToastStore();
const { addToast } = toastStore;

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

await getPaymentMethods();

const isLoading = ref(false);
const isAddCardMode = ref(false);
const isDeleteModalOpen = ref(false);
const activePaymentMethod = ref<PaymentMethod['externalRef'] | null>(null);

// Timer to update payment methods after creation
let updateTimer: ReturnType<typeof useTimeoutFn> | null = null;
const UPDATE_PAYMENT_METHODS_DELAY = 5000; // 5 seconds

const onSubmit = async () => {
  try {
    isLoading.value = true;

    if (updateTimer) {
      updateTimer.stop();
    }

    const result = await cardComponent.value?.tokenize();
    const token = result.token;
    await createPaymentMethod(token);
    await getPaymentMethods(false);

    // Chargebee api is not updated immediately,
    // so we need to wait about 5 seconds
    // to get the updated payment methods
    updateTimer = useTimeoutFn(() => {
      getPaymentMethods(false);
    }, UPDATE_PAYMENT_METHODS_DELAY);
    updateTimer.start();
  } catch {
    addToast({
      type: 'error',
      text: t('failedToAddPaymentMethod'),
    });
  } finally {
    isLoading.value = false;
    handleCancelAddCardMode();
  }
};

const handleCancelAddCardMode = () => {
  isAddCardMode.value = false;
};
</script>

<template>
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

  <section data-testpl="account-payment" class="rounded-8 flex flex-row gap-24 bg-white p-24">
    <div class="flex w-full flex-col gap-24">
      <div class="flex items-center justify-between gap-24">
        <p>{{ $t('paymentDetails') }}</p>

        <template v-if="greaterOrEqualLg">
          <BaseButton
            v-if="isAddCardMode"
            theme="outline"
            size="37"
            @click="handleCancelAddCardMode"
          >
            {{ $t('cancel') }}
          </BaseButton>

          <BaseButton
            v-if="!isAddCardMode"
            data-testpl="account-payment-add-card-btn"
            theme="outline"
            size="37"
            @click="isAddCardMode = true"
          >
            {{ $t('addNew') }}
          </BaseButton>
        </template>
      </div>

      <div v-show="!isAddCardMode">
        <ul v-if="paymentMethods && paymentMethods.length !== 0">
          <li v-for="(method, index) in paymentMethods" :key="method.externalRef">
            <BaseSeparator v-if="index !== 0" class="bg-bone" />
            <div class="py-24">
              <CreditCardItem
                data-testpl="account-payment-card-item"
                :method
                @set-default="setPrimaryPaymentMethodImmediately(method.externalRef)"
                @delete="
                  activePaymentMethod = method.externalRef;
                  isDeleteModalOpen = true;
                "
              />
            </div>
          </li>
        </ul>
        <div v-else class="text-12 flex flex-col items-center gap-8 font-medium">
          <IconNoPayment class="shrink-0" />
          <span>
            {{ $t('paymentMethodNotAdded') }}
          </span>
        </div>
      </div>

      <div v-show="isAddCardMode" class="flex flex-col gap-16">
        <p class="text-beige text-10 uppercase">
          {{ $t('addNewPaymentMethod') }}
        </p>
        <CreditCardForm :is-loading="isLoading" />
      </div>

      <div v-if="!greaterOrEqualLg || isAddCardMode" class="flex flex-col gap-12">
        <BaseButton
          v-if="!isAddCardMode && !greaterOrEqualLg"
          data-testpl="account-payment-add-card-btn"
          theme="outline"
          size="37"
          @click="isAddCardMode = true"
        >
          {{ $t('addNew') }}
        </BaseButton>

        <template v-else>
          <BaseButton
            v-if="isAddCardMode && !greaterOrEqualLg"
            theme="outline"
            size="37"
            @click="handleCancelAddCardMode"
          >
            {{ $t('cancel') }}
          </BaseButton>
        </template>
        <BaseButton
          v-if="isAddCardMode"
          size="37"
          class="w-full lg:w-fit"
          :loading="isLoading"
          @click="onSubmit"
        >
          {{ $t('addCard') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>
