<script setup lang="ts">
// TODO: until the circumstances are clarified
// import PatientFooter from '@/components/PatientFooter/PatientFooter.vue';
// import WidgetGiftKinsyn from '@/components/WidgetGiftKinsyn/WidgetGiftKinsyn.vue';
import WidgetConditions from '@/components/WidgetConditions/WidgetConditions.vue';
import WidgetConnectDevice from '@/components/WidgetConnectDevice/WidgetConnectDevice.vue';
import WidgetLastMessage from '@/components/WidgetLastMessage/WidgetLastMessage.vue';
import WidgetMyProgress from '@/components/WidgetMyProgress/WidgetMyProgress.vue';
import WidgetOngoingMedications from '@/components/WidgetOngoingMedications/WidgetOngoingMedications.vue';
import WidgetProductFeed from '@/components/WidgetProductFeed/WidgetProductFeed.vue';
import WidgetTerra from '@/components/WidgetTerra/WidgetTerra.vue';
import WidgetUpcomingShipments from '@/components/WidgetUpcomingShipments/WidgetUpcomingShipments.vue';
import WidgetVitals from '@/components/WidgetVitals/WidgetVitals.vue';
import WidgetWelcome from '@/components/WidgetWelcome/WidgetWelcome.vue';
import { useMasonryGrid } from '@/composables/useMasonryGrid';
import { waitTransition } from '@/utils/pageTransition.ts';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { useTemplateRef, watch } from 'vue';

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const masonryGrid = useTemplateRef<HTMLElement | null>('masonryGrid');

const { masonryStop, masonryStart, masonryRecalc } = useMasonryGrid(masonryGrid);

await waitTransition();

watch(greaterOrEqualLg, () => {
  if (greaterOrEqualLg.value) {
    masonryStart();
  } else {
    masonryStop();
  }
});
</script>

<template>
  <section ref="masonryGrid" class="dashboard" data-page-in="fadeInUp" data-page-out="fadeOutUp">
    <WidgetWelcome class="order-1 col-span-4 col-start-1 lg:order-none" @loaded="masonryRecalc" />

    <WidgetLastMessage
      class="order-2 col-span-4 col-start-1 lg:order-none lg:col-span-8 lg:col-start-5"
      @loaded="masonryRecalc"
    />

    <!-- TODO: until the circumstances are clarified -->
    <!-- <div class="rounded-8 col-span-4 bg-white p-16 lg:p-24" data-testpl="dashboard-biological-age">
      <div class="flex flex-col gap-16">
        <h2 class="text-21 lg:text-26 font-secondary" data-testpl="card-header">
          {{ $t('biologicalAge') }}
        </h2>
        <span class="text-96 font-secondary">57.2</span>
        <span class="text-14">
          Your biological age is 12 years younger than your calendar age.
        </span>
        <span class="text-14">
          Based on your lab tests from Nov 2024. Find out more about how to slow down aging process.
        </span>
      </div>
    </div> -->

    <WidgetOngoingMedications
      class="order-3 col-span-4 col-start-1 lg:order-none"
      @loaded="masonryRecalc"
    />

    <WidgetConditions
      class="order-5 col-span-4 col-start-1 lg:order-none lg:col-start-5"
      @loaded="masonryRecalc"
    />

    <WidgetConnectDevice
      class="order-9 col-span-4 col-start-1 lg:order-none lg:col-start-9"
      @loaded="masonryRecalc"
    />

    <WidgetUpcomingShipments
      class="order-4 col-span-4 col-start-1 lg:order-none"
      @loaded="masonryRecalc"
    />

    <WidgetVitals
      class="order-7 col-span-4 col-start-1 lg:order-none lg:col-start-9"
      @loaded="masonryRecalc"
    />

    <WidgetMyProgress
      class="order-6 col-span-4 col-start-1 lg:order-none lg:col-start-5"
      @loaded="masonryRecalc"
    />

    <!--      TODO: we hide it until there is a backend-->
    <!--      <WidgetGiftKinsyn :code class="col-span-4 lg:col-start-9 order-10 lg:order-none" />-->

    <WidgetTerra
      class="order-8 col-span-4 col-start-1 lg:order-none lg:col-start-9"
      @updated="masonryRecalc"
    />
  </section>

  <div class="row">
    <WidgetProductFeed class="col-span-4 lg:col-span-12" />
  </div>

  <!--  TODO: until the circumstances are clarified-->
  <!--  <PatientFooter class="mt-40" />-->
</template>

<style>
@reference '@/assets/css/main.css';

.dashboard {
  @apply lg:row mb-40 flex flex-col gap-y-16 lg:gap-y-24;
}

.dashboard > * {
  @apply transition-shadow hover:shadow-md;
}
</style>
