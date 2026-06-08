<script setup lang="ts">
import ReactivateSubscriptionItem from './components/ReactivateSubscriptionItem.vue';
import { useTreatments } from './composables/useTreatments';
import IconAutoRenews from '@/assets/icons/auto-renews.svg?component';
import IconOrder from '@/assets/icons/order.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import type { ModifiedSubscriptionItem } from '@/types/subscription';
import { formatPrice, formatUnitPeriod } from '@/utils/formatters';
import { computed } from 'vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const model = defineModel<boolean>();

const props = defineProps<{
  subscriptions?: ModifiedSubscriptionItem[];
  isApproveMembership?: boolean;
}>();

const emit = defineEmits<{
  success: [value: void];
}>();

const { t } = useI18n();

const { reActivateSubscriptions, reActivateSubscriptionsLoading, approveMembership } =
  useTreatments();

const subscriptionIdsToRemove = ref<number[]>([]);

const isMonthlyShippingSubscription = computed(
  /* it doesn't matter which one we take because they all belong to the same treatment */
  () =>
    props.subscriptions?.[0]?.variant?.variantShippingPeriodUnit === 'month' &&
    props.subscriptions?.[0]?.variant?.variantShippingPeriod === 1,
);

const variantShippingPeriod = computed(() => {
  return props.subscriptions?.[0]?.variant?.variantShippingPeriod;
});

const variantShippingPeriodUnit = computed(() => {
  return props.subscriptions?.[0]?.variant?.variantShippingPeriodUnit;
});

const reactivatePrice = computed(() => {
  const subscriptionsWithoutRemoveItems = props.subscriptions?.filter((item) => {
    return !subscriptionIdsToRemove.value.includes(item.id);
  });
  return subscriptionsWithoutRemoveItems?.reduce((acc, obj) => acc + obj.total, 0);
});

const shippingTreatment = computed(() => {
  const shippingItem = props.subscriptions?.find((item) => item.refExternal.includes('shipping'));
  return shippingItem?.total ? formatPrice(shippingItem.total) : t('freeShipping');
});

const isShippingInfoDisplayed = computed(() => {
  return props.subscriptions?.some((item) => {
    if (subscriptionIdsToRemove.value.includes(item.id)) return false;

    return !item.product?.isDisplayedFromPrescription;
  });
});

const handleRemove = (id: number) => {
  subscriptionIdsToRemove.value.push(id);
};

const handleAdd = (id: number) => {
  subscriptionIdsToRemove.value = subscriptionIdsToRemove.value.filter((item) => item !== id);
};

const handleReActivateSubscriptions = async () => {
  if (props.subscriptions?.[0]?.treatmentId) {
    if (props.isApproveMembership) {
      if (
        await approveMembership(props.subscriptions[0].treatmentId, subscriptionIdsToRemove.value)
      ) {
        model.value = false;
        emit('success');
      }

      return;
    }

    if (
      await reActivateSubscriptions(
        props.subscriptions[0].treatmentId,
        subscriptionIdsToRemove.value,
      )
    ) {
      model.value = false;
      emit('success');
    }
  }
};
</script>

<template>
  <BaseDialog
    v-model:open="model"
    position="right"
    class="max-w-424"
    data-testpl="drawer-reactivate-treatment"
  >
    <template #header>
      {{ $t('reActivationPlan') }}
    </template>

    <template #content>
      <ul class="flex flex-col gap-8" data-testpl="drawer-reactivate-subscriptions">
        <ReactivateSubscriptionItem
          v-for="subscription in subscriptions"
          :subscription
          :subscription-ids-to-remove
          :key="subscription.id"
          @remove="handleRemove"
          @add="handleAdd"
        />
      </ul>

      <ul class="bg-sand/20 rounded-8 mt-24 flex flex-col gap-12 p-16">
        <li class="flex items-center gap-8">
          <IconAutoRenews class="shrink-0 lg:size-20" />

          <i18n-t
            keypath="autoRenewsEveryMonth"
            tag="p"
            class="text-14"
            data-testpl="drawer-reactivate-subscriptions-price"
          >
            <template #total>
              <span data-testpl="drawer-reactivate-subscriptions-value">
                {{ formatPrice(reactivatePrice) }}
              </span>
            </template>
          </i18n-t>
        </li>

        <li v-if="isShippingInfoDisplayed" class="flex items-center gap-8">
          <IconOrder class="shrink-0 lg:size-20" />

          <i18n-t
            v-if="isMonthlyShippingSubscription"
            keypath="eachShipmentWillContainSupply"
            tag="p"
            class="text-14"
            data-testpl="drawer-reactivate-subscriptions-shipment-info"
          >
            <template #value>
              <span
                class="lowercase"
                data-testpl="drawer-reactivate-subscriptions-shipment-info-value"
              >
                {{ formatUnitPeriod(variantShippingPeriod, variantShippingPeriodUnit) }}
              </span>
            </template>
          </i18n-t>

          <i18n-t
            v-else
            keypath="eachShipmentWillContainWorthSupply"
            tag="p"
            class="text-secondary-text"
            data-testpl="drawer-reactivate-subscriptions-supply-info"
          >
            <template #value>
              <span
                class="lowercase"
                data-testpl="drawer-reactivate-subscriptions-supply-info-value"
              >
                {{ formatUnitPeriod(variantShippingPeriod, variantShippingPeriodUnit) }}
              </span>
            </template>
          </i18n-t>
        </li>
      </ul>

      <div
        class="bg-sand/20 rounded-8 mt-24 flex flex-col gap-12 p-16"
        data-testpl="drawer-reactivate-subscriptions-price-block"
      >
        <h2 class="text-21 font-secondary">
          {{ t('overview') }}
        </h2>

        <div class="text-18 flex flex-col gap-12">
          <p class="flex items-center justify-between gap-16">
            <span>
              {{ t('shipping') }}
            </span>

            <span data-testpl="drawer-reactivate-subscriptions-shipping-price">
              {{ shippingTreatment }}
            </span>
          </p>

          <p class="flex items-center justify-between gap-16 font-bold">
            <span>
              {{ t('total') }}
            </span>

            <span data-testpl="drawer-reactivate-subscriptions-total-price">
              {{ formatPrice(reactivatePrice) }}
            </span>
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <BaseButton
        class="w-full"
        :loading="reActivateSubscriptionsLoading"
        data-testpl="drawer-reactivate-subscriptions-btn"
        @click="handleReActivateSubscriptions"
      >
        {{ $t('requestReActivation') }}
        ({{ formatPrice(reactivatePrice) }})
      </BaseButton>
    </template>
  </BaseDialog>
</template>
