<script setup lang="ts">
import OrderDetails from './components/OrderDetails.vue';
import OrderItem from './components/OrderItem.vue';
import UpcomingShipment from './components/UpcomingShipment.vue';
import IconChevronLeft from '@/assets/icons/chevron-left.svg?component';
import IconChevronRight from '@/assets/icons/chevron-right.svg?component';
import IconOrder from '@/assets/icons/order.svg?component';
import IconPharmacy from '@/assets/icons/pharmacy.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BlockFiller from '@/components/BlockFiller/BlockFiller.vue';
import { useShipments } from '@/composables/useShipments';
import { useSwiper } from '@/composables/useSwiper';
import type { ShipmentDetails } from '@/types/shipment';
import { breakpointsTailwind, useBreakpoints, useInfiniteScroll } from '@vueuse/core';
import { getYear } from 'date-fns';
import { ref, useTemplateRef, watch } from 'vue';

const {
  shipments,
  fetchShipments,
  updateShipments,
  shipmentsLoading,
  getUpcomingShipmentsItems,
  upcomingShipmentsItems,
  years,
} = useShipments();

const START_PAGE = 0;

const page = ref<number>(START_PAGE);
const selectedYear = ref<number>(getYear(new Date()));

await Promise.all([getUpcomingShipmentsItems(), fetchShipments(page.value, selectedYear.value)]);

const showOrderDetailsDrawer = ref(false);
const shipmentDetails = ref<ShipmentDetails>();
const shipmentsContainer = useTemplateRef<HTMLElement>('shipmentsContainer');

const {
  isSwiperBeginning,
  isSwiperEnd,
  onSwiperSlideChange,
  onSwiperInit,
  prevSlide,
  nextSlide,
  slidesPerView,
  onResize,
} = useSwiper();

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

useInfiniteScroll(
  shipmentsContainer,
  () => {
    if (shipmentsLoading.value) {
      return;
    }

    page.value += 1;
    updateShipments(page.value, selectedYear.value);
  },
  { distance: 10 },
);

const onShowOrderDetailsClick = (shipment: ShipmentDetails) => {
  shipmentDetails.value = shipment;
  showOrderDetailsDrawer.value = true;
};

const sortByYearShipments = async (year: number) => {
  page.value = START_PAGE;
  selectedYear.value = year;
  await fetchShipments(page.value, year);
};

watch(showOrderDetailsDrawer, (value) => {
  if (!value) {
    shipmentDetails.value = undefined;
  }
});
</script>

<template>
  <div
    class="row col-span-4 flex flex-col gap-24 lg:col-span-10 lg:gap-40"
    data-page-in="fadeInUp"
    data-page-out="fadeOutUp"
    data-testpl="my-orders"
  >
    <OrderDetails v-model="showOrderDetailsDrawer" :shipment-details />

    <h1 class="text-32 lg:text-40 font-secondary" data-testpl="my-orders-title">
      {{ $t('myOrders') }}
    </h1>

    <section
      v-if="upcomingShipmentsItems.length"
      class="flex flex-col gap-24"
      data-page-in="fadeInUp"
      data-page-out="fadeOutUp"
      data-testpl="upcoming-shipments"
    >
      <h2 class="text-24 lg:text-26 font-secondary" data-testpl="upcoming-shipments-title">
        {{ $t('myUpcomingShipments') }}
      </h2>

      <div
        v-if="upcomingShipmentsItems.length > 1"
        class="relative"
        data-testpl="upcoming-shipments-swiper-wrapper"
      >
        <Transition
          enter-active-class="animate-[zoomIn_0.3s]"
          leave-active-class="animate-[zoomOut_0.3s]"
        >
          <BaseButton
            v-if="!isSwiperBeginning && greaterOrEqualLg"
            size="40"
            rounded
            color="gray"
            class="absolute top-1/2 left-24 z-10 -translate-y-1/2"
            data-testpl="upcoming-shipments-swiper-prev-slide-btn"
            @click="prevSlide"
          >
            <template #prepend>
              <IconChevronLeft class="size-20" />
            </template>
          </BaseButton>
        </Transition>

        <swiper-container
          class="swiper relative size-full"
          data-testpl="upcoming-shipments-swiper"
          :slides-per-view="1.33"
          :space-between="24"
          @swiperinit="onSwiperInit"
          @swiperslidechange="onSwiperSlideChange"
          @swiperresize="onResize"
        >
          <swiper-slide
            v-for="orderItem in upcomingShipmentsItems"
            :key="orderItem.id"
            data-testpl="upcoming-shipments-slide"
          >
            <UpcomingShipment :orderItem />
          </swiper-slide>
        </swiper-container>

        <Transition
          enter-active-class="animate-[zoomIn_0.3s]"
          leave-active-class="animate-[zoomOut_0.3s]"
        >
          <BaseButton
            v-if="!isSwiperEnd && greaterOrEqualLg && slidesPerView"
            size="40"
            rounded
            color="gray"
            class="absolute top-1/2 right-24 z-10 -translate-y-1/2"
            data-testpl="upcoming-shipments-swiper-next-slide-btn"
            @click="nextSlide"
          >
            <template #prepend>
              <IconChevronRight class="size-20" />
            </template>
          </BaseButton>
        </Transition>
      </div>

      <ul v-else data-testpl="upcoming-shipments-list">
        <li v-for="orderItem in upcomingShipmentsItems" :key="orderItem.id">
          <UpcomingShipment :order-item />
        </li>
      </ul>
    </section>

    <BlockFiller
      v-else
      :title="$t('noUpcomingShipments')"
      :icon="IconPharmacy"
      :caption="$t('hereYouWillHaveAnOverviewOfAllYourUpcomingShipments')"
      data-testpl="upcoming-shipments-filler"
    />

    <section
      ref="shipmentsContainer"
      data-page-in="fadeInUp"
      data-page-out="fadeOutUp"
      data-testpl="order-history"
    >
      <h2 class="text-24 lg:text-26 font-secondary" data-testpl="order-history-title">
        {{ $t('orderHistory') }}
      </h2>

      <ul class="flex gap-24" data-testpl="order-history-years">
        <li
          v-for="year in years"
          :key="year"
          class="text-21 font-secondary py-24 transition-colors"
          data-testpl="order-history-year"
          :class="{
            'text-disabled-text': selectedYear !== year,
          }"
        >
          <button type="button" @click="sortByYearShipments(year)">
            {{ year }}
          </button>
        </li>
      </ul>

      <ul
        v-if="shipments?.length"
        class="rounded-8 bg-white px-24"
        data-testpl="order-history-list"
      >
        <li v-for="shipment in shipments" :key="shipment.id">
          <OrderItem :shipment @see-details="onShowOrderDetailsClick" />
        </li>
      </ul>

      <BlockFiller
        v-else
        tag="div"
        :icon="IconOrder"
        class="mt-24"
        :title="$t('noOrderHistory')"
        :caption="$t('yourOrdersWillAppearHere')"
        :button-label="$t('seeTreatments')"
        data-testpl="order-list-filler"
        :to="{ name: 'PatientTreatments' }"
      />
    </section>
  </div>
</template>
