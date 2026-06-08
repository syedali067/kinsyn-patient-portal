<script setup lang="ts">
import type { BiomarkersSummary } from '@/types/health.ts';
import { computed } from 'vue';

const props = defineProps<{
  summary?: BiomarkersSummary;
}>();

const emit = defineEmits<{
  filter: [value: string];
}>();

const biomarkersTotal = computed(() => {
  if (props.summary)
    return props.summary.inRange + props.summary.outOfRange + props.summary.improving;
  else return 0;
});

const barStyle = (value: number) => {
  const max = 180;
  const minWidth = 8;
  const maxWidth = 300;

  if (value === 0) {
    return { width: '8px' };
  }

  if (value >= max) {
    return { width: `${maxWidth}px`, maxWidth: 'calc(100% - 60px)' };
  }

  const normalizedValue = value / max;
  const widthInPx = minWidth + (maxWidth - minWidth) * normalizedValue;

  return { width: `${widthInPx}px`, maxWidth: 'calc(100% - 60px)' };
};
</script>

<template>
  <div class="rounded-8 col-span-4 flex flex-col justify-between gap-24 bg-white p-24">
    <div class="flex flex-col gap-8">
      <h2 class="text-26 font-secondary">
        {{ $t('labs') }} <span v-if="biomarkersTotal">({{ biomarkersTotal }})</span>
      </h2>
      <p class="text-14 text-secondary-text">
        <span v-if="summary?.improving">
          {{ summary.improving }}
          <span class="lowercase">
            {{ $t('biomarkersHaveShownImprovementsInYourLatestTest') }}&nbsp;
          </span>
        </span>
        <span v-if="summary?.inRange || summary?.outOfRange || summary?.improving">
          {{ $t('clickOnAnyCategoryToFilterYourBiomarkers') }}
        </span>
        <span v-else>
          {{ $t('looksLikeYouHaventTakenYourLabsTest') }}
        </span>
      </p>
    </div>

    <div class="flex flex-col gap-12">
      <button
        type="button"
        class="flex flex-col gap-8 text-left"
        :disabled="!summary?.inRange"
        @click="emit('filter', 'inRange')"
      >
        <span class="text-12">{{ $t('inRange') }}</span>
        <div class="flex min-w-0 items-center gap-8">
          <div
            class="rounded-2 h-28 min-w-8 flex-shrink"
            :class="summary?.inRange ? 'bg-jungle-green' : 'bg-disabled-bg'"
            :style="barStyle(summary?.inRange || 0)"
          />
          <span class="text-32 font-secondary flex-shrink-0">{{ summary?.inRange || 0 }}</span>
        </div>
      </button>
      <button
        type="button"
        class="flex flex-col gap-8 text-left"
        :disabled="!summary?.outOfRange"
        @click="emit('filter', 'outOfRange')"
      >
        <span class="text-12">{{ $t('outOfRange') }}</span>
        <div class="flex min-w-0 items-center gap-8">
          <div
            class="rounded-2 h-28 min-w-8 flex-shrink"
            :class="summary?.outOfRange ? 'bg-light-coral' : 'bg-disabled-bg'"
            :style="barStyle(summary?.outOfRange || 0)"
          />
          <span class="text-32 font-secondary flex-shrink-0">{{ summary?.outOfRange || 0 }}</span>
        </div>
      </button>
      <button
        class="flex flex-col gap-8 text-left"
        :disabled="!summary?.improving"
        @click="emit('filter', 'improving')"
      >
        <span class="text-12">{{ $t('improving') }}</span>
        <div class="flex min-w-0 items-center gap-8">
          <div
            class="rounded-2 h-28 min-w-8 flex-shrink"
            :class="summary?.improving ? 'bg-light-blue' : 'bg-disabled-bg'"
            :style="barStyle(summary?.improving || 0)"
          />
          <span class="text-32 font-secondary flex-shrink-0">{{ summary?.improving || 0 }}</span>
        </div>
      </button>
    </div>
  </div>
</template>
