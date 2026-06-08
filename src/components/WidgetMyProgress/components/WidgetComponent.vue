<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseChart from '@/components/BaseChart/BaseChart.vue';

defineProps<{
  progress?: {
    id: number;
    value: number;
    date: Date;
  }[];
  currentWeight?: number;
  goalWeight?: number;
  percentAchieved?: number;
  maxLength: number;
}>();
</script>

<template>
  <div
    class="rounded-8 flex flex-col gap-24 bg-white p-16 lg:gap-32 lg:p-24"
    data-testpl="widget-my-progress"
  >
    <h2 class="text-21 lg:text-26 font-secondary" data-testpl="widget-my-progress-title">
      {{ $t('myProgress') }}
    </h2>

    <BaseChart
      v-if="progress?.length"
      class="h-200"
      :data="progress"
      type="line-indexed"
      curve="curveBumpX"
      :max-length
      points
      y-axis
    />

    <div class="flex gap-56" data-testpl="widget-my-progress-info">
      <p class="flex flex-col gap-8" data-testpl="widget-my-progress-current-weight">
        <span class="text-14">
          {{ $t('currentWeightLbs') }}
        </span>

        <span
          class="text-48 text-stone font-secondary"
          data-testpl="widget-my-progress-current-weight-value"
        >
          {{ currentWeight ? currentWeight : $t('noData') }}
        </span>
      </p>

      <p
        v-if="percentAchieved !== undefined && Number.isFinite(percentAchieved)"
        class="flex flex-col gap-8"
        data-testpl="widget-my-progress-goal-weight"
      >
        <span class="text-14">
          {{ $t('goalCompletion') }}
        </span>

        <span
          class="text-48 text-stone font-secondary"
          data-testpl="widget-my-progress-goal-weight-value"
        >
          {{ Math.floor(percentAchieved) }}%
        </span>
      </p>
    </div>

    <BaseButton
      v-if="progress?.length"
      class="w-full"
      :to="{ name: 'PatientProgress' }"
      data-testpl="widget-my-progress-show-all-progress-btn"
    >
      {{ $t('showAllProgress') }}
    </BaseButton>

    <!-- TODO: need link for new checkout (WL category) -->
    <BaseButton v-else class="w-full" href="''" data-testpl="widget-my-progress-see-treatments-btn">
      {{ $t('seeTreatments') }}
    </BaseButton>
  </div>
</template>
