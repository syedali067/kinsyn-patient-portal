<script setup lang="ts">
import type { DrawerModifyTreatmentSubscription } from '../types';
import IconCheck from '@/assets/icons/check.svg?component';
import IconOrder from '@/assets/icons/order.svg?component';
import IconRx from '@/assets/icons/rx.svg?component';
import IconShipment from '@/assets/icons/shipment.svg?component';
import IconTime from '@/assets/icons/time.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { useSubscriptionItem } from '@/composables/useSubscriptionItem';
import { SubscriptionStatus } from '@/enums/subscription.ts';
import { TreatmentReviewStatus } from '@/enums/treatment';
import type { ModifiedSubscriptionItem } from '@/types/subscription';
import { formatUnitPeriod } from '@/utils/formatters';
import { format, isFuture } from 'date-fns';

const props = defineProps<{
  subscription: ModifiedSubscriptionItem;
}>();

const emit = defineEmits<{
  openModifyTreatment: [value: DrawerModifyTreatmentSubscription];
  openReactivateTreatment: [treatmentId: number, isMembership?: boolean];
}>();

const {
  planStatus,
  imageUrl,
  imageAlt,
  isRxOnly,
  categoryName,
  itemType,
  itemTitle,
  formattedPriceWithDiscount,
  formattedPriceWithPeriod,
  formattedDosage,
  quantity,
  cancellationDate,
  nextShipmentDate,
  isMonthlyShippingSubscription,
} = useSubscriptionItem(props.subscription);

const onOpenModifyTreatment = () => {
  if (props.subscription.productId) {
    emit('openModifyTreatment', {
      treatmentId: props.subscription.treatmentId,
      productId: props.subscription.productId,
      itemType: itemType.value,
      planStatus: planStatus.value,
      refExternal: props.subscription.refExternal,
      subscriptionStatus: props.subscription.status,
    });
  }
};
</script>

<template>
  <li
    class="rounded-4 grid grid-cols-[minmax(auto,min-content)_auto] grid-rows-[minmax(auto,min-content)_minmax(auto,min-content)_minmax(auto,min-content)] gap-x-16 p-16 lg:grid-cols-[minmax(auto,min-content)_auto_auto] lg:gap-x-24 lg:p-24"
    :class="planStatus === 'pending' ? 'bg-white/50' : 'bg-white'"
    :id="subscription.id.toString()"
    data-testpl="subscription-item"
    :data-treatment-id="subscription.treatmentId"
  >
    <figure
      class="rounded-4 bg-sand/20 relative mb-16 h-96 w-84 overflow-hidden p-16 lg:col-span-1 lg:row-span-3 lg:mb-0 lg:h-185 lg:w-156"
    >
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="imageAlt"
        class="h-full w-full object-contain"
        data-testpl="subscription-item-img"
      />
      <IconRx
        v-if="isRxOnly"
        class="absolute top-8 left-8 size-20 lg:top-16 lg:left-16"
        data-testpl="subscription-item-rx-icon"
      />
    </figure>

    <div
      class="col-start-2 mb-16 flex flex-col lg:col-span-1 lg:col-start-2 lg:row-span-2 lg:mb-24"
      data-testpl="subscription-item-info"
    >
      <span
        v-if="categoryName"
        class="text-12 text-beige font-medium uppercase"
        data-testpl="subscription-item-category-name"
      >
        {{ categoryName }}
      </span>

      <span
        v-if="itemType"
        class="text-secondary-text text-12 mt-12"
        data-testpl="subscription-item-type"
      >
        {{ $t(itemType) }}
      </span>

      <h2 class="text-21 lg:text-26 font-secondary mt-4" data-testpl="subscription-item-title">
        {{ itemTitle }}
      </h2>

      <p class="text-14 lg:text-18 mt-12 lowercase">
        <span
          v-if="formattedPriceWithPeriod"
          data-testpl="subscription-item-price"
          :class="{
            'text-secondary-text line-through': formattedPriceWithDiscount,
          }"
        >
          {{ formattedPriceWithPeriod }}
        </span>
        <span
          class="pl-5"
          v-if="formattedPriceWithDiscount"
          data-testpl="subscription-item-price-with-discount"
        >
          {{ formattedPriceWithDiscount }}
        </span>
      </p>

      <p
        v-if="formattedDosage"
        class="text-14 lg:text-16 mt-12 flex items-center gap-4"
        data-testpl="subscription-item-dosage"
      >
        <span class="text-secondary-text"> {{ $t('dosage') }}: </span>

        <span data-testpl="subscription-item-dosage-value">
          {{ formattedDosage }}
        </span>
      </p>

      <p v-if="quantity" class="text-14 lg:text-16 mt-4" data-testpl="subscription-item-quantity">
        <span class="text-secondary-text"> {{ $t('quantity') }}: </span>

        <span data-testpl="subscription-item-quantity-value">
          {{ quantity }}
        </span>
      </p>
    </div>

    <div
      class="order-3 col-span-2 mt-24 flex w-full gap-16 lg:order-2 lg:col-span-1 lg:col-start-3 lg:mt-0 lg:justify-end"
    >
      <BaseButton
        v-if="planStatus === 'approved'"
        theme="outline"
        color="dark"
        class="w-full lg:w-fit"
        data-testpl="subscription-item-modify-plan-btn"
        @click="onOpenModifyTreatment"
      >
        {{ $t('modifyPlan') }}
      </BaseButton>

      <BaseButton
        v-if="planStatus === 'pending'"
        theme="outline"
        color="dark"
        class="w-full lg:w-fit"
        data-testpl="subscription-item-pending-approval-btn"
        @click="onOpenModifyTreatment"
      >
        <template #prepend>
          <IconTime class="size-20 shrink-0" />
        </template>
        {{ $t('pendingApproval') }}
      </BaseButton>

      <BaseButton
        v-if="
          planStatus === 'cancelled' &&
          subscription.treatment.reviewStatus !== TreatmentReviewStatus.Pending
        "
        theme="outline"
        color="dark"
        class="w-full lg:w-fit"
        data-testpl="subscription-item-re-activate-btn"
        @click="emit('openReactivateTreatment', subscription.treatmentId)"
      >
        {{ $t('reActivate') }}
      </BaseButton>
    </div>

    <div
      class="col-span-2 flex w-full flex-col justify-between gap-16 lg:col-span-2 lg:col-start-2 lg:row-span-1 lg:row-start-3 lg:gap-24"
    >
      <div
        v-if="planStatus !== 'declined'"
        class="border-bone flex flex-col gap-16 border-t pt-16 md:justify-between lg:flex-row lg:gap-24"
      >
        <span
          v-if="planStatus === 'cancelled' && cancellationDate"
          class="text-14 text-error"
          data-testpl="subscription-item-cancellation-date"
        >
          {{
            isFuture(cancellationDate)
              ? $t('treatmentPlanWillBeCancelledOn')
              : $t('treatmentPlanCancelledOn')
          }}
          <br />
          {{ cancellationDate }}
        </span>

        <div v-else class="flex flex-col gap-8">
          <span>
            {{ $t('yourPlan') }}
          </span>

          <span
            v-if="planStatus === 'pending'"
            class="text-14 text-warning"
            data-testpl="subscription-item-review-info"
          >
            {{ $t('providerWillReviewYourRequest') }}
          </span>

          <span
            v-if="planStatus === 'approved' && nextShipmentDate"
            class="text-secondary-text text-12"
            data-testpl="subscription-item-next-shipment-date"
          >
            {{ $t('nextShipment') }}: {{ nextShipmentDate }}
          </span>
        </div>

        <div v-if="!subscription.isPaymentFailed">
          <ul v-if="!subscription.isPrescription" class="text-14 lg:text-12 flex flex-col gap-8">
            <template
              v-if="
                subscription.variant?.variantShippingPeriod &&
                subscription.variant?.variantShippingPeriodUnit
              "
            >
              <li class="flex items-center gap-4">
                <IconOrder class="shrink-0 lg:size-20" />

                <i18n-t
                  :keypath="
                    isMonthlyShippingSubscription
                      ? 'eachShipmentWillContainSupply'
                      : 'eachShipmentWillContainWorthSupply'
                  "
                  tag="p"
                  class="text-secondary-text"
                  data-testpl="subscription-item-supply-info"
                >
                  <template #value>
                    <span class="lowercase" data-testpl="subscription-item-supply-info-value">
                      {{
                        formatUnitPeriod(
                          subscription.variant?.variantShippingPeriod,
                          subscription.variant?.variantShippingPeriodUnit,
                        )
                      }}
                    </span>
                  </template>
                </i18n-t>
              </li>

              <li class="flex items-center gap-4">
                <IconShipment class="shrink-0 lg:size-20" />

                <span
                  v-if="isMonthlyShippingSubscription"
                  class="text-secondary-text"
                  data-testpl="subscription-item-shipment-info-value"
                >
                  {{ $t('shippedMonthly') }}
                </span>

                <i18n-t
                  v-else
                  keypath="shippedEvery"
                  tag="p"
                  class="text-secondary-text"
                  data-testpl="subscription-item-shipment-info"
                >
                  <template #value>
                    <span class="lowercase" data-testpl="subscription-item-shipment-info-value">
                      {{
                        formatUnitPeriod(
                          subscription.variant?.variantShippingPeriod,
                          subscription.variant?.variantShippingPeriodUnit,
                        )
                      }}
                    </span>
                  </template>
                </i18n-t>
              </li>
            </template>
          </ul>

          <div v-else class="flex items-center gap-4">
            <IconCheck class="shrink-0 lg:size-20" />

            <span class="text-secondary-text" data-testpl="subscription-item-renewed-info">
              {{ $t('renewedEveryMonth') }}
            </span>
          </div>
        </div>

        <!-- TODO: need design -->
        <!-- <div v-else>
          PaymentFailed
        </div> -->
      </div>

      <div
        v-if="subscription.dateDeclined && planStatus === 'declined'"
        class="flex flex-col gap-4"
      >
        <p class="text-14 text-error" data-testpl="subscription-item-declined-date">
          {{ $t('treatmentPlanDeclinedOn') }}
          {{ format(subscription.dateDeclined, 'MMMM d, y') }}
        </p>
        <div
          v-if="subscription.isMainProduct && subscription.status === SubscriptionStatus.Future"
          class="order-3 col-span-2 mt-24 flex w-full gap-16 lg:order-2 lg:col-span-1 lg:col-start-3 lg:mt-0 lg:justify-end"
        >
          <BaseButton
            theme="outline"
            class="w-full lg:w-fit"
            data-testpl="subscription-item-accept-plan-btn"
            @click="emit('openReactivateTreatment', subscription.treatmentId, true)"
          >
            {{ $t('accept') }}
          </BaseButton>

          <!-- <BaseButton
            theme="outline"
            class="w-full lg:w-fit"
            data-testpl="subscription-item-cancel-plan-btn"
            @click="onOpenModifyTreatment"
          >
            {{ $t('cancelTreatment') }}
          </BaseButton> -->
        </div>

        <!-- TODO: need design -->
        <!-- <p class="text-14">
          {{ $t('ifYouHaveAnyQuestionsPleaseEmail') }}
          <a class="text-primary-500" :href="`mailto:${EMAIL}`">
            {{ EMAIL }}
          </a>
        </p> -->
      </div>
    </div>
  </li>
</template>
