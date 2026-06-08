<script setup lang="ts">
import ModalCancelOrder from '@/components/EditOrder/components/ModalCancelOrder.vue';
import ModalChangeShipmentDate from '@/components/EditOrder/components/ModalChangeShipmentDate.vue';
import ModalEditOrder from '@/components/EditOrder/components/ModalEditOrder.vue';
import ModalOrderQuantity from '@/components/EditOrder/components/ModalOrderQuantity.vue';
import { ref } from 'vue';

const isEditOrderModalShowed = ref(false);
const isOrderQuantityModalShowed = ref(false);
const isCancelOrderModalShowed = ref(false);
const isChangeShipmentDateModalShowed = ref(false);

const emit = defineEmits<{
  'edit-order-close': [];
}>();

const startEditOrder = () => {
  isEditOrderModalShowed.value = true;
};

const startEditOrderQuantity = () => {
  isEditOrderModalShowed.value = false;
  isOrderQuantityModalShowed.value = true;
};

const startChangeShipmentDate = () => {
  isEditOrderModalShowed.value = false;
  isChangeShipmentDateModalShowed.value = true;
};

const startCancelOrder = () => {
  isEditOrderModalShowed.value = false;
  isCancelOrderModalShowed.value = true;
};

const onEditOrderClose = () => {
  if (
    !isChangeShipmentDateModalShowed.value &&
    !isCancelOrderModalShowed.value &&
    !isOrderQuantityModalShowed.value
  ) {
    emit('edit-order-close');
  }
};

defineExpose({
  startEditOrder,
});
</script>

<template>
  <ModalEditOrder
    v-model="isEditOrderModalShowed"
    @change-order-quantity="startEditOrderQuantity"
    @cancel-order="startCancelOrder"
    @change-shipment-date="startChangeShipmentDate"
    @close="onEditOrderClose"
  />

  <ModalOrderQuantity v-model="isOrderQuantityModalShowed" @close="isEditOrderModalShowed = true" />

  <ModalCancelOrder v-model="isCancelOrderModalShowed" @close="isEditOrderModalShowed = true" />

  <ModalChangeShipmentDate
    v-model="isChangeShipmentDateModalShowed"
    @close="isEditOrderModalShowed = true"
  />
</template>
