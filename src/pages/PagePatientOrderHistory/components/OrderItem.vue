<script setup lang="ts">
import IconDownload from '@/assets/icons/download.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { useShipments } from '@/composables/useShipments';
import { ShipmentStatus } from '@/enums/shipment';
import type { Shipment, ShipmentDetails } from '@/types/shipment';
import { formatPrice, stringToSecondaryReadableDateFormat } from '@/utils/formatters';
import { ref } from 'vue';

defineProps<{
  shipment: Shipment;
}>();

const emit = defineEmits<{
  'see-details': [shipment: ShipmentDetails];
}>();

const { getShipmentStatus, downloadInvoice, getShipment } = useShipments();

const downloadInvoiceLoading = ref(false);
const shipmentLoading = ref(false);

const isRedColorOfStatus = (status: ShipmentStatus) =>
  [ShipmentStatus.Cancelled, ShipmentStatus.Returned].includes(status);

const onSeeDetailsClick = async (id: Shipment['id']) => {
  try {
    shipmentLoading.value = true;

    const shipment = await getShipment(id);

    if (shipment) {
      emit('see-details', shipment);
    }
  } finally {
    shipmentLoading.value = false;
  }
};

const onDownloadInvoiceClick = async (id: Shipment['invoice']['id']) => {
  try {
    downloadInvoiceLoading.value = true;
    await downloadInvoice(id);
  } finally {
    downloadInvoiceLoading.value = false;
  }
};
</script>

<template>
  <div
    class="not-last:border-bone flex flex-col gap-16 border-b border-transparent py-24"
    data-testpl="order-list-item"
  >
    <span
      :class="[
        'text-beige text-10 font-medium uppercase',
        {
          'text-error': isRedColorOfStatus(shipment.status),
        },
      ]"
      data-testpl="order-list-item-status"
    >
      {{ getShipmentStatus(shipment.status) }}
    </span>

    <div
      class="grid grid-cols-[1fr_repeat(2,auto)] grid-rows-[repeat(2,auto)] gap-x-12 gap-y-16 lg:grid-cols-[1fr_repeat(4,auto)] lg:grid-rows-1 lg:items-center"
    >
      <div class="flex grow flex-col gap-8 whitespace-nowrap">
        <span class="text-21 font-secondary" data-testpl="order-list-item-date">
          {{ stringToSecondaryReadableDateFormat(shipment.invoice.dateCreated) }}
        </span>

        <span class="text-14 text-stone font-medium" data-testpl="order-list-item-order">
          #{{ shipment.invoice.refExternal }}
        </span>
      </div>

      <span
        class="text-21 font-secondary col-span-2 text-right lg:col-auto lg:mr-28"
        data-testpl="order-list-item-product-price"
      >
        {{ formatPrice(shipment.total, shipment.currency) }}
      </span>

      <BaseButton
        class="col-span-2 lg:col-auto"
        :loading="shipmentLoading"
        data-testpl="order-list-item-details-btn"
        @click="onSeeDetailsClick(shipment.id)"
      >
        {{ $t('seeDetails') }}
      </BaseButton>

      <BaseButton
        theme="outline"
        :loading="downloadInvoiceLoading"
        :title="$t('downloadInvoice')"
        data-testpl="order-list-item-download-btn"
        @click="onDownloadInvoiceClick(shipment.invoice.id)"
      >
        <template #prepend>
          <IconDownload class="size-20" />
        </template>
      </BaseButton>
    </div>
  </div>
</template>
