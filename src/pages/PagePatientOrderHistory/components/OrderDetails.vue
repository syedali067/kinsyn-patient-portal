<script setup lang="ts">
import SvgMastercard from '@/assets/images/mastercard.svg?component';
import SvgVisa from '@/assets/images/visa.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import ProductImage from '@/components/ProductImage/ProductImage.vue';
import { useShipments } from '@/composables/useShipments';
import { type ShipmentAddressFormattedData } from '@/pages/PagePatientOrderHistory/types';
import type { OrderItem, Shipment, ShipmentDetails } from '@/types/shipment';
import {
  formatPhoneNumber,
  formatPrice,
  stringToSecondaryReadableDateFormat,
} from '@/utils/formatters';
import { isEqual, sumBy } from 'lodash-es';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const isShowed = defineModel<boolean>({ required: true });

const props = defineProps<{
  shipmentDetails?: ShipmentDetails;
}>();

const { t } = useI18n();

const { getShipmentStatusText, downloadInvoice, getFormattedAddress, findLabelCategoryById } =
  useShipments();

const digitalItems = computed(() =>
  props.shipmentDetails?.orderItems.filter((item) => item.productType === 'Digital'),
);

const digitalItemsAmount = computed(() => sumBy(digitalItems.value, 'amountPaid') || 0);

const orderItems = computed(() =>
  props.shipmentDetails?.orderItems.filter((item) => item.productType !== 'Digital'),
);

const formattedBillingAddress = computed<ShipmentAddressFormattedData[]>(() => {
  if (!props.shipmentDetails) return [];

  const { billingAddress } = props.shipmentDetails;

  return getFormattedAddress(billingAddress);
});

const formattedShippingAddress = computed<ShipmentAddressFormattedData[]>(() => {
  if (!props.shipmentDetails) return [];

  const { shippingAddress } = props.shipmentDetails;

  return getFormattedAddress(shippingAddress);
});

const isBillingAndShippingAddressesAreSame = computed(() =>
  isEqual(formattedBillingAddress.value, formattedShippingAddress.value),
);

const paymentIcon = computed(() => {
  switch (props.shipmentDetails?.invoice.paymentDetails?.brand) {
    case 'visa':
      return SvgVisa;
    case 'mastercard':
      return SvgMastercard;
    default:
      return null;
  }
});

const getPlanTitle = (item: OrderItem) =>
  item.refExternal.includes('tier') ? t('coachingMembership') : t('basicMembership');

const downloadInvoiceLoading = ref(false);
const onDownloadInvoiceClick = async (id: Shipment['invoice']['id']) => {
  try {
    downloadInvoiceLoading.value = true;

    await downloadInvoice(id);
  } finally {
    downloadInvoiceLoading.value = false;
  }
};

const coupon = computed(() =>
  props.shipmentDetails?.invoice.discounts.find((d) => d.type === 'coupon'),
);
const couponAmount = computed(() => coupon.value?.amount ?? 0);
const couponCode = computed(() => coupon.value?.coupon ?? '');

const membership = computed(() =>
  props.shipmentDetails?.invoice.discounts.find((d) => d.type === 'membership'),
);
const membershipAmount = computed(() => membership.value?.amount ?? 0);
</script>

<template>
  <BaseDialog
    v-model:open="isShowed"
    class="max-w-424"
    position="right"
    data-testpl="order-details-modal"
  >
    <template #header>
      {{ $t('orderDetails') }}
    </template>

    <template #content>
      <div v-if="shipmentDetails" class="flex h-full flex-col gap-32 overflow-y-auto">
        <div class="border-bone flex gap-16 border-b pb-16">
          <div class="flex grow flex-col gap-8" data-testpl="order-details-modal-info">
            <span class="text-18" data-testpl="order-details-modal-info-date">
              {{ stringToSecondaryReadableDateFormat(shipmentDetails.invoice.dateCreated) }}
            </span>

            <span class="text-14 text-secondary-text" data-testpl="order-details-modal-info-order">
              #{{ shipmentDetails.invoice.refExternal }}
            </span>
          </div>
        </div>

        <h3 class="text-14 font-medium uppercase" data-testpl="order-details-modal-overview-title">
          {{ $t('orderOverview') }}
        </h3>

        <div v-for="(orderItem, index) in orderItems" :key="orderItem.id">
          <div class="text-14 mb-8" data-testpl="order-details-modal-overview-package">
            {{ $t('packageOf', { number: index + 1, total: orderItems?.length }) }}
          </div>

          <div
            class="text-14 text-secondary-text mb-16 empty:hidden"
            data-testpl="order-details-modal-overview-status"
          >
            {{ getShipmentStatusText(orderItem) }}
          </div>

          <div class="mb-16">
            <div
              class="not-last:border-bone flex min-w-0 items-center gap-16 border-b-1 border-transparent py-24 first:pt-0 last:pb-0"
              data-testpl="order-details-modal-overview-item"
            >
              <ProductImage
                v-if="orderItem.productImage"
                class="shrink-0"
                :image="orderItem.productImage"
                :href="orderItem.url"
                data-testpl="order-details-modal-overview-item-img"
              />

              <div class="flex min-w-0 grow flex-col gap-8">
                <span
                  class="text-10 text-beige font-medium uppercase empty:hidden"
                  data-testpl="order-details-modal-overview-item-category"
                >
                  {{ findLabelCategoryById(orderItem.productCategorySlug) }}
                </span>

                <div class="flex min-w-0 items-center gap-8">
                  <span
                    class="min-w-0 grow truncate"
                    data-testpl="order-details-modal-overview-item-title"
                  >
                    {{ orderItem.description }}
                  </span>

                  <span
                    v-if="orderItem.discountAmount"
                    class="text-12 text-secondary-text shrink-0 line-through"
                    data-testpl="order-details-modal-overview-item-price"
                  >
                    {{ formatPrice(orderItem.amount) }}
                  </span>

                  <span class="shrink-0" data-testpl="order-details-modal-overview-item-price">
                    {{ formatPrice(orderItem.amountPaid) }}
                  </span>
                </div>

                <span
                  class="text-14 text-secondary-text truncate"
                  data-testpl="order-details-modal-overview-subtitle"
                >
                  {{ orderItem.productClarification }}
                </span>
              </div>
            </div>
          </div>

          <BaseButton
            :href="orderItem.trackingUrl"
            :disabled="!orderItem.trackingUrl"
            theme="outline"
            class="w-full"
            target="_blank"
            data-testpl="order-details-modal-overview-item-track-btn"
          >
            {{ $t('trackOrder') }}
          </BaseButton>
        </div>

        <div v-if="digitalItems?.length">
          <h3 class="text-14 font-medium uppercase">
            {{ $t('digitalItems') }}
          </h3>

          <div
            v-for="item in digitalItems"
            :key="item.id"
            class="not-last:border-bone flex items-center gap-16 border-b-1 border-transparent py-24 first:pt-0 last:pb-0"
          >
            <ProductImage v-if="item.productImage" :image="item.productImage" />

            <span class="grow truncate">
              {{ getPlanTitle(item) }}
            </span>

            <span class="shrink-0">
              {{ formatPrice(item.amountPaid) }}
            </span>
          </div>
        </div>

        <h3 class="text-14 font-medium uppercase" data-testpl="order-details-modal-payment-title">
          {{ $t('paymentOverview') }}
        </h3>

        <div data-testpl="order-details-modal-payment">
          <div
            class="text-14 not-first:border-bone flex flex-col gap-12 border-t-1 border-transparent not-first:pt-24 not-last:pb-32"
            data-testpl="order-details-modal-payment-shipping"
          >
            <h4 class="mb-4">
              {{ $t('shippingDetails') }}
            </h4>

            <template v-for="item in formattedShippingAddress" :key="`shipping-${item.value}`">
              <p
                v-if="item.value"
                :class="{
                  'text-secondary-text': item.isSecondary,
                }"
              >
                <a v-if="item.isEmail" :href="`mailto:${item.value}`">
                  {{ item.value }}
                </a>

                <a v-else-if="item.isPhoneNumber" :href="`tel:${item.value}`">
                  {{ formatPhoneNumber(item.value) }}
                </a>

                <span v-else>
                  {{ item.value }}
                </span>
              </p>
            </template>
          </div>

          <div
            class="text-14 not-first:border-bone flex flex-col gap-12 border-t-1 border-transparent not-first:pt-24 not-last:pb-32"
            data-testpl="order-details-modal-payment-billing"
          >
            <p>
              {{ $t('billingDetails') }}
            </p>

            <div v-if="isBillingAndShippingAddressesAreSame">
              <p class="text-secondary-text">
                {{ $t('sameAsShippingDetails') }}
              </p>
            </div>

            <template v-else-if="formattedBillingAddress.length > 0">
              <template v-for="item in formattedBillingAddress" :key="`billing-${item.value}`">
                <p
                  v-if="item.value"
                  :class="{
                    'text-secondary-text': item.isSecondary,
                  }"
                >
                  <a v-if="item.isEmail" :href="`mailto:${item.value}`">
                    {{ item.value }}
                  </a>

                  <a v-else-if="item.isPhoneNumber" :href="`tel:${item.value}`">
                    {{ formatPhoneNumber(item.value) }}
                  </a>

                  <span v-else>
                    {{ item.value }}
                  </span>
                </p>
              </template>
            </template>

            <p v-else class="text-secondary-text">
              {{ $t('notSpecified') }}
            </p>
          </div>

          <div
            v-if="shipmentDetails.invoice.paymentDetails"
            class="text-14 not-first:border-bone flex flex-col items-start gap-12 border-t-1 border-transparent not-first:pt-24 not-last:pb-32"
            data-testpl="order-details-modal-payment-payment-details"
          >
            <h4 class="mb-4">
              {{ $t('paymentDetails') }}
            </h4>

            <component v-if="paymentIcon" :is="paymentIcon" class="w-46" />

            <p>
              <span class="capitalize">{{ shipmentDetails.invoice.paymentDetails.brand }}</span>
              {{ $t('endingIn') }}
              {{ shipmentDetails.invoice.paymentDetails.last4 }}
            </p>

            <p class="text-secondary-text">
              {{ $t('expirationDate') }}
              {{ shipmentDetails.invoice.paymentDetails.expiry_month }}/{{
                shipmentDetails.invoice.paymentDetails.expiry_year
              }}
            </p>
          </div>

          <div
            class="text-14 not-first:border-bone flex flex-col gap-12 border-t-1 border-transparent not-first:pt-24 not-last:pb-32"
            data-testpl="order-details-modal-summary"
          >
            <p v-if="digitalItems?.length" class="flex items-center gap-8">
              <span class="grow" data-testpl="order-details-modal-summary-digital-items">
                {{ $t('digitalItems') }}
              </span>

              <span class="shrink-0" data-testpl="order-details-modal-summary-digital-items-value">
                {{ formatPrice(digitalItemsAmount) }}
              </span>
            </p>

            <p v-if="couponAmount > 0" class="flex items-center gap-8">
              <span class="grow" data-testpl="order-details-modal-summary-coupon-code">
                {{ $t('couponCode') }}
              </span>

              <span
                class="text-secondary-text text-10 max-w-[20ch] shrink-0 truncate"
                data-testpl="order-details-modal-summary-coupon-code-coupons"
              >
                {{ couponCode }}
              </span>

              <span class="shrink-0" data-testpl="order-details-modal-summary-coupon-code-value">
                -{{ formatPrice(couponAmount) }}
              </span>
            </p>

            <p v-if="membershipAmount > 0" class="flex items-center gap-8">
              <span class="grow" data-testpl="order-details-modal-summary-membership">
                {{ $t('membershipSavings') }}
              </span>

              <span class="shrink-0" data-testpl="order-details-modal-summary-membership-amount">
                -{{ formatPrice(membershipAmount) }}
              </span>
            </p>

            <p class="flex items-center gap-8">
              <span class="grow" data-testpl="order-details-modal-summary-subtotal">
                {{ $t('subtotal') }}
              </span>

              <span
                v-if="shipmentDetails.discountSubTotal !== shipmentDetails.subtotal"
                class="text-secondary-text text-10 line-through"
                data-testpl="order-details-modal-summary-subtotal-line-through"
              >
                {{ formatPrice(shipmentDetails.subtotal) }}
              </span>

              <span data-testpl="order-details-modal-summary-subtotal-value">
                {{ formatPrice(shipmentDetails.discountSubTotal) }}
              </span>
            </p>

            <p class="flex items-center gap-8">
              <span class="grow" data-testpl="order-details-modal-summary-shipping">
                {{ $t('shipping') }}
              </span>

              <span
                v-if="shipmentDetails.shipping"
                data-testpl="order-details-modal-summary-shipping-value"
              >
                {{ formatPrice(shipmentDetails.shipping) }}
              </span>

              <span
                v-else
                class="text-secondary-text"
                data-testpl="order-details-modal-summary-shipping-free"
              >
                {{ $t('free') }}
              </span>
            </p>

            <p class="flex items-center gap-8">
              <span class="grow" data-testpl="order-details-modal-summary-total">
                {{ $t('total') }}
              </span>

              <span
                v-if="shipmentDetails.discountTotal !== shipmentDetails.total"
                class="text-10 text-secondary-text line-through"
                data-testpl="order-details-modal-summary-total-line-through"
              >
                {{ formatPrice(shipmentDetails.total) }}
              </span>

              <span data-testpl="order-details-modal-summary-total-value">
                {{ formatPrice(shipmentDetails.discountTotal) }}
              </span>
            </p>
          </div>
        </div>

        <BaseButton
          :loading="downloadInvoiceLoading"
          theme="outline"
          class="w-full shrink-0"
          data-testpl="order-details-modal-download-btn"
          @click="onDownloadInvoiceClick(shipmentDetails.invoice.id)"
        >
          {{ $t('downloadInvoice') }}
        </BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>
