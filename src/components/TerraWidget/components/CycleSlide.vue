<script setup lang="ts">
import type { TerraWidgetCycleSlideData, TerraWidgetSlideTheme } from '../types';
import { computed } from 'vue';

const props = defineProps<{
  data: TerraWidgetCycleSlideData;
  theme: TerraWidgetSlideTheme;
}>();

const textClass = computed(() => {
  switch (props.theme) {
    case 'brown':
    case 'dark':
      return 'text-white';
    case 'light':
    default:
      return 'text-black';
  }
});

const cycleProgressInPercent = computed(() => {
  return (props.data.cycleDay / props.data.cycleLengthDays) * 100;
});

const cycleProgressMarkers = computed(() => {
  const days = props.data.cycleLengthDays;
  const markers = [];

  for (let i = 0; i < 5; i++) {
    const value = Math.round(1 + (i * (days - 1)) / 4);
    markers.push(value);
  }

  return markers;
});
</script>

<template>
  <div class="flex h-full flex-col" :class="textClass">
    <div class="rounded-8 my-36 grid min-h-220 grid-cols-[1fr_120px] overflow-hidden">
      <div class="bg-coal/75 mr-1 p-24 pb-14 capitalize">
        <div class="text-14 mb-4">
          {{ $t('currentPhase') }}
        </div>

        <div class="text-21 font-secondary mb-16">
          {{ $t(data.menstruationPhase) }}
        </div>

        <div class="text-14 mb-4">
          {{ $t('currentPeriodDates') }}
        </div>

        <div class="text-21 font-secondary">{{ data.periodStart }} – {{ data.periodEnd }}</div>
      </div>

      <div class="bg-coal/75 p-12 pt-34">
        <div class="mx-auto w-min">
          <div class="flex items-center gap-3">
            <div class="text-14">
              {{ $t('cycleDay') }}
            </div>

            <div class="text-40 font-secondary">{{ data.cycleDay }}</div>
          </div>

          <hr class="border-stone my-8" />

          <div class="text-12 whitespace-nowrap lowercase">
            {{ $t('of') }} {{ data.cycleLengthDays }} {{ $t('days') }}
          </div>
        </div>
      </div>

      <div class="bg-coal/75 col-span-2 mt-1 p-24">
        <div class="bg-bone rounded-2 relative mb-4 h-8">
          <div
            class="rounded-2 absolute top-0 left-0 h-full bg-stone-500"
            :style="{ width: `${cycleProgressInPercent}%` }"
          />
        </div>

        <div class="text-12 flex justify-between">
          <div v-for="marker in cycleProgressMarkers" :key="marker">
            {{ $t('day') }} {{ marker }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-16">
      <p class="text-18 font-medium">
        {{ $t(data.menstruationPhase) }} <span class="lowercase">{{ $t('phase') }}</span>
      </p>

      <p>
        {{ data.menstruationPhaseExplanation }}
      </p>

      <p>
        <span class="capitalize"> {{ $t('estimatedNextPeriod') }}: </span>

        {{ data.nextPeriodDay }}
      </p>
    </div>
  </div>
</template>
