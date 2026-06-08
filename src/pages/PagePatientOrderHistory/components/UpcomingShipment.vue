<script setup lang="ts">
import IconOrder from '@/assets/icons/order.svg?component';
import IconShipment from '@/assets/icons/shipment.svg?component';
/* import BaseButton from '@/components/BaseButton/BaseButton.vue'; */
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
import { useStaticData } from '@/composables/useStaticData';
import type { OrderItemWithSubscription } from '@/types/shipment';
import { formatPrice, formatUnitPeriod } from '@/utils/formatters';
import { format } from 'date-fns';
import { computed } from 'vue';

const props = defineProps<{
  orderItem: OrderItemWithSubscription;
}>();

const { categories } = useStaticData();

const categoryName = computed(() => {
  const categorySlug = props.orderItem.product?.quizCategories[0];
  if (!categorySlug) return;
  return categories.value.find((category) => category.id === categorySlug)?.label;
});

const isMonthlyShipping = computed(
  () =>
    props.orderItem.productVariant?.variantShippingPeriodUnit === 'month' &&
    props.orderItem.productVariant?.variantShippingPeriod === 1,
);
</script>

<template>
  <div
    data-testpl="upcoming-shipment"
    class="grid grid-cols-[84px_auto] grid-rows-[repeat(5,auto)] gap-16 bg-white p-16 lg:grid-cols-[156px_1fr_auto] lg:grid-rows-[repeat(3,auto)] lg:gap-24 lg:p-24"
  >
    <figure
      data-testpl="upcoming-shipment-figure"
      class="rounded-4 bg-sand/20 h-96 w-84 shrink-0 overflow-hidden lg:row-span-3 lg:h-185 lg:w-156"
    >
      <img
        v-if="orderItem.image"
        class="size-full shrink-0 object-cover"
        :src="orderItem.image"
        :alt="orderItem.description"
        data-testpl="upcoming-shipment-image"
      />
    </figure>

    <div data-testpl="upcoming-shipment-info" class="col-start-2 flex flex-col">
      <span
        v-if="categoryName"
        class="text-10 text-beige font-medium uppercase"
        data-testpl="upcoming-shipment-category-name"
      >
        {{ categoryName }}
      </span>

      <span
        class="text-21 lg:text-26 font-secondary mt-12"
        data-testpl="upcoming-shipment-description"
      >
        {{ orderItem.description }}
      </span>

      <div class="mt-12 flex flex-col gap-4">
        <span
          v-if="orderItem.discountAmount"
          class="text-12 text-secondary-text line-through"
          data-testpl="upcoming-shipment-discount"
        >
          {{ formatPrice(orderItem.amount) }}
        </span>

        <span class="text-14 lg:text-18" data-testpl="upcoming-shipment-amount">
          {{ formatPrice(orderItem.amountPaid) }}
        </span>
      </div>
    </div>

    <BaseSeparator
      v-if="
        orderItem.subscription?.dateNext ||
        (orderItem.productVariant?.variantShippingPeriod &&
          orderItem.productVariant.variantShippingPeriodUnit)
      "
      class="bg-bone col-span-2 row-start-2 lg:col-start-2"
    />

    <template v-if="orderItem.subscription?.dateNext">
      <div
        class="col-span-2 flex flex-col gap-6 lg:col-span-1 lg:col-start-2 lg:row-start-3"
        data-testpl="upcoming-shipment-plan"
      >
        <span data-testpl="upcoming-shipment-plan-title">
          {{ $t('yourPlan') }}
        </span>

        <span class="text-secondary-text text-12" data-testpl="upcoming-shipment-plan-value">
          {{ $t('nextShipment') }}:
          {{ format(orderItem.subscription.dateNext, 'MMMM dd, yyyy') }}
        </span>
      </div>
    </template>

    <!-- Hide for this moment -->
    <!-- <BaseButton
      class="col-span-2 row-start-4 w-full lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:ml-auto lg:max-w-200"
      theme="outline"
    >
      {{ $t('editOrder') }}
    </BaseButton> -->

    <template v-if="orderItem.productVariant">
      <ul
        class="col-span-2 row-start-5 lg:col-span-1 lg:col-start-3 lg:row-start-3"
        data-testpl="upcoming-shipment-period"
      >
        <template
          v-if="
            orderItem.productVariant.variantShippingPeriod &&
            orderItem.productVariant.variantShippingPeriodUnit
          "
        >
          <li class="flex items-center gap-4" data-testpl="upcoming-shipment-period-item">
            <IconOrder class="shrink-0 lg:size-20" />

            <i18n-t
              :keypath="
                isMonthlyShipping
                  ? 'eachShipmentWillContainSupply'
                  : 'eachShipmentWillContainWorthSupply'
              "
              tag="p"
              class="text-secondary-text"
              data-testpl="upcoming-shipment-period-item-info"
            >
              <template #value>
                <span class="lowercase" data-testpl="upcoming-shipment-period-item-value">
                  {{
                    formatUnitPeriod(
                      orderItem.productVariant.variantShippingPeriod,
                      orderItem.productVariant.variantShippingPeriodUnit,
                    )
                  }}
                </span>
              </template>
            </i18n-t>
          </li>

          <li class="flex items-center gap-4" data-testpl="upcoming-shipment-period-item">
            <IconShipment class="shrink-0 lg:size-20" />

            <span
              v-if="isMonthlyShipping"
              class="text-secondary-text"
              data-testpl="upcoming-shipment-period-shipment-info-value"
            >
              {{ $t('shippedMonthly') }}
            </span>

            <i18n-t
              v-else
              keypath="shippedEvery"
              tag="p"
              class="text-secondary-text"
              data-testpl="upcoming-shipment-period-item-info"
            >
              <template #value>
                <span class="lowercase" data-testpl="upcoming-shipment-period-item-value">
                  {{
                    formatUnitPeriod(
                      orderItem.productVariant.variantShippingPeriod,
                      orderItem.productVariant.variantShippingPeriodUnit,
                    )
                  }}
                </span>
              </template>
            </i18n-t>
          </li>
        </template>
      </ul>
    </template>
  </div>
</template>
