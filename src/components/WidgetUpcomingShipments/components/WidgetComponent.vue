<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import type { OrderItem } from '@/types/shipment.ts';
import { uniqBy } from 'lodash-es';
import { computed } from 'vue';

const props = defineProps<{
  shipmentsItems?: OrderItem[] | null;
}>();

const lastThreeOrderItems = computed(() => {
  return uniqBy(props.shipmentsItems, 'id').slice(0, 3);
});
</script>

<template>
  <div
    class="rounded-8 flex flex-col bg-white p-16 lg:p-24"
    :class="lastThreeOrderItems.length ? 'gap-24' : 'gap-32'"
    data-testpl="dashboard-shipment"
  >
    <h2 class="text-21 lg:text-26 font-secondary" data-testpl="card-header">
      {{ $t('upcomingShipments') }}
    </h2>

    <div v-if="lastThreeOrderItems.length" class="flex flex-col gap-24 lg:gap-32">
      <div class="flex flex-col gap-16">
        <div
          v-for="item in lastThreeOrderItems"
          :key="item.id"
          class="flex items-center justify-between gap-12"
          data-testpl="card-item"
        >
          <div class="flex items-center gap-16">
            <a
              :href="item.url"
              class="bg-bone rounded-8 flex h-88 max-w-88 min-w-88 flex-col items-center justify-center py-8"
              data-testpl="card-item-link"
            >
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.description"
                class="h-full w-full object-contain"
                data-testpl="card-item-img"
              />
            </a>

            <div class="flex w-full flex-col gap-6">
              <p class="text-21 font-secondary" data-testpl="card-item-name">
                {{ item.description }}
              </p>
              <!--                TODO: correct date after adding estimated date-->
              <!--              <p class="text-stone text-p3">-->
              <!--                {{ $t('estimatedDelivery') }}: -{{ format(shipment.dateUpdated, 'MMM d, yyyy') }}- -->
              <!--              </p>-->
            </div>
          </div>
        </div>
      </div>

      <BaseButton
        v-if="shipmentsItems && shipmentsItems.length > 3"
        :to="{ name: 'PatientOrderHistory' }"
        class="w-full"
        data-testpl="card-button"
      >
        {{ $t('showAll') }}
      </BaseButton>
    </div>

    <div v-else class="text-p3">
      {{ $t('noShipmentsDue') }}
    </div>
  </div>
</template>
