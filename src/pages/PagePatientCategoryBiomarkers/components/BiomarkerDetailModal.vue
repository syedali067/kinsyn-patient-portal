<script setup lang="ts">
import { useBiomarkers } from '../composables/useBiomarkers.ts';
import IconArrowLeft from '@/assets/icons/arrow-left.svg?component';
import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import IconClose from '@/assets/icons/close.svg?component';
import BaseAccordion from '@/components/BaseAccordion/BaseAccordion.vue';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import BaseTooltip from '@/components/BaseTooltip/BaseTooltip.vue';
import InsightsBlock from '@/components/InsightsBlock/InsightsBlock.vue';
import SafeText from '@/components/SafeText/SafeText.vue';
import type { Biomarker } from '@/types/health.ts';
import { messageOptions } from '@/utils/htmlSanitizerOptions.ts';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { format } from 'date-fns';
import { isFinite } from 'lodash-es';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const isOpen = defineModel<boolean>('open', { default: false });

const props = defineProps<{
  currentBiomarker: Biomarker;
  biomarkers: Biomarker[];
  date?: string;
  aiSettingsEnabled: boolean;
}>();

const emit = defineEmits<{
  'update:currentBiomarker': [biomarker: Biomarker];
}>();

const { hasNumericRange, getRangeParts, isNumericValue } = useBiomarkers();
const { t } = useI18n();
const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');
const smallerMd = breakpoints.smaller('md');

const getPointWithOffset = (x: number, y: number, nextX: number, nextY: number, radius: number) => {
  const dx = nextX - x;
  const dy = nextY - y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return { x, y };

  const offsetX = (dx / distance) * radius;
  const offsetY = (dy / distance) * radius;

  return {
    x: x + offsetX,
    y: y + offsetY,
  };
};

const chartCoordinates = computed(() => {
  if (!chartData.value) return { points: [], lines: [] };

  const points = chartData.value.points.map((point, index) => {
    const x = 50 + (index - (chartData.value!.points.length - 1) / 2) * 20;
    const y = 100 - point.position - 0.5;

    return {
      ...point,
      x,
      y,
      leftPercent: `${x}%`,
      topPercent: `${y}%`,
    };
  });

  const lines = points
    .slice(0, -1)
    .map((point, index) => {
      const nextPoint = points[index + 1];
      if (!nextPoint) return null;
      const startOffset = 3;
      const endOffset = index + 1 === points.length - 1 ? 4.5 : 3;

      const start = getPointWithOffset(point.x, point.y, nextPoint.x, nextPoint.y, startOffset);
      const end = getPointWithOffset(nextPoint.x, nextPoint.y, point.x, point.y, endOffset);

      return {
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
      };
    })
    .filter((line): line is { x1: number; y1: number; x2: number; y2: number } => line !== null);

  return { points, lines };
});

const getBiomarkerKey = (biomarker: Biomarker) =>
  `${biomarker.parameterName}-${biomarker.parameterValue}`;

const currentIndex = computed(() => {
  if (!props.currentBiomarker) return 0;
  const currentKey = getBiomarkerKey(props.currentBiomarker);
  return props.biomarkers.findIndex((b) => getBiomarkerKey(b) === currentKey) + 1;
});

const goToPrevious = () => {
  if (!props.currentBiomarker) return;
  const currentKey = getBiomarkerKey(props.currentBiomarker);
  const currentIdx = props.biomarkers.findIndex((b) => getBiomarkerKey(b) === currentKey);
  const prevBiomarker = props.biomarkers[currentIdx - 1];
  if (currentIdx > 0 && prevBiomarker) {
    emit('update:currentBiomarker', prevBiomarker);
  }
};

const goToNext = () => {
  if (!props.currentBiomarker) return;
  const currentKey = getBiomarkerKey(props.currentBiomarker);
  const currentIdx = props.biomarkers.findIndex((b) => getBiomarkerKey(b) === currentKey);
  const nextBiomarker = props.biomarkers[currentIdx + 1];
  if (currentIdx < props.biomarkers.length - 1 && nextBiomarker) {
    emit('update:currentBiomarker', nextBiomarker);
  }
};

const accordionItems = computed(() => {
  if (!props.currentBiomarker) return [];

  return [
    {
      title: t('about') + ' ' + props.currentBiomarker.parameterName,
      content: props.currentBiomarker.about,
    },
    {
      title: t('aboutYourTestResults'),
      content: props.currentBiomarker.clinicalComments,
    },
    {
      title: t('whyItMatters'),
      content: props.currentBiomarker.whyItMatters,
    },
  ].filter((item) => item.content);
});

const chartData = computed(() => {
  if (!props.currentBiomarker?.referenceRange || !hasNumericRange(props.currentBiomarker))
    return null;

  const [minValue = 0, maxValue = 0] = getRangeParts(props.currentBiomarker.referenceRange);
  const range = maxValue - minValue;

  const sortedProgress = props.currentBiomarker.progress
    ? [...props.currentBiomarker.progress].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )
    : [];

  // Only numeric values (exclude ">11.00", "<88.5", "Tnp", etc.)
  const numericProgress = sortedProgress.filter((p) => isFinite(Number(p.value)));

  const currentValue = parseFloat(props.currentBiomarker.parameterValue);
  const currentIsNumeric = isFinite(currentValue);
  const allPoints = [...numericProgress];

  const hasCurrentInProgress =
    currentIsNumeric && numericProgress.some((p) => parseFloat(p.value) === currentValue);
  if (currentIsNumeric && !hasCurrentInProgress) {
    allPoints.push({
      value: props.currentBiomarker.parameterValue,
      date: props.date || new Date().toISOString(),
    });
  }

  const lastThreePoints = allPoints.slice(-3);

  const progressPoints = lastThreePoints.map((point) => {
    const value = parseFloat(point.value);

    let position;
    if (value < minValue) {
      const belowRange = (minValue - value) / range;
      position = 33.33 - belowRange * 33.33;
    } else if (value > maxValue) {
      const aboveRange = (value - maxValue) / range;
      position = 66.67 + aboveRange * 33.33;
    } else {
      const positionInRange = (value - minValue) / range;
      position = 33.33 + positionInRange * 33.33;
    }

    const isInRange = value >= minValue && value <= maxValue;

    return {
      value,
      position: Math.max(9, Math.min(91, position)),
      isInRange,
      date: format(new Date(point.date), 'MMM d, yyyy'),
    };
  });

  return {
    minValue,
    maxValue,
    points: progressPoints,
  };
});
</script>

<template>
  <BaseDialog
    v-model:open="isOpen"
    position="right"
    :close-btn="false"
    class="max-w-672"
    @keydown.left="goToPrevious"
    @keydown.right="goToNext"
  >
    <template #header>
      <div class="flex w-full flex-col gap-16">
        <div class="flex w-full items-start justify-between gap-40">
          <h1 v-if="greaterOrEqualLg" class="text-40 font-secondary min-w-0 flex-1 break-words">
            {{ currentBiomarker.parameterName }}
          </h1>

          <div
            class="mt-6 flex shrink-0 items-center justify-between gap-32 lg:w-auto lg:justify-start"
          >
            <div v-if="props.biomarkers.length > 1" class="flex items-center gap-12">
              <BaseButton
                size="32"
                rounded
                color="gray"
                :disabled="currentIndex === 1"
                @click="goToPrevious"
              >
                <template #prepend>
                  <IconArrowLeft class="size-20" />
                </template>
              </BaseButton>
              <span class="text-disabled-text">
                {{ currentIndex }}/{{ props.biomarkers.length }}
              </span>
              <BaseButton
                size="32"
                color="gray"
                rounded
                :disabled="currentIndex === props.biomarkers.length"
                @click="goToNext"
              >
                <template #prepend>
                  <IconArrowRight class="size-20" />
                </template>
              </BaseButton>
            </div>

            <BaseButton size="32" color="gray" rounded class="shrink-0" @click="isOpen = false">
              <template #prepend>
                <IconClose class="size-20" />
              </template>
            </BaseButton>
          </div>
        </div>

        <p
          v-if="currentBiomarker.parameterSubname && greaterOrEqualLg"
          class="text-secondary-text text-14"
        >
          {{ currentBiomarker.parameterSubname }}
        </p>

        <p v-if="greaterOrEqualLg" class="text-21 font-secondary text-secondary-text">
          {{ currentBiomarker.description }}
        </p>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-16">
        <div v-if="!greaterOrEqualLg" class="flex flex-col gap-8">
          <h1 class="text-26 font-secondary">
            {{ currentBiomarker.parameterName }}
          </h1>

          <p v-if="currentBiomarker.parameterSubname" class="text-secondary-text text-14 mb-8">
            {{ currentBiomarker.parameterSubname }}
          </p>

          <p class="text-18 text-secondary-text">{{ currentBiomarker.description }}</p>
        </div>

        <div
          class="bg-site-bg rounded-8 flex flex-col gap-24 px-16 pt-20 lg:px-24"
          :class="{
            'pb-49 lg:pb-70': chartData && isNumericValue(currentBiomarker),
            'pb-20': !chartData || !isNumericValue(currentBiomarker),
          }"
        >
          <div class="flex flex-col gap-8">
            <div class="flex items-baseline justify-between gap-16">
              <div class="flex items-baseline gap-5">
                <span class="text-40 lg:text-48 font-secondary">
                  {{ currentBiomarker.parameterValue }}
                  <span v-if="currentBiomarker.previousValues?.length">*</span>
                </span>
                <span class="text-18 lg:text-21 font-secondary">{{ currentBiomarker.units }}</span>
              </div>
              <p
                class="font-medium uppercase"
                :class="{
                  'text-jungle-green': currentBiomarker.inRange === true,
                  'text-light-coral': currentBiomarker.inRange === false,
                  'text-disabled-text': currentBiomarker.inRange === null,
                }"
              >
                {{ currentBiomarker.rangeDescription }}
              </p>
            </div>

            <p
              v-if="currentBiomarker.previousValues?.length"
              class="text-14 text-secondary-text text-left"
            >
              *{{ $t('correctedResult') }}. {{ $t('previousReportedResult') }}:
              {{ currentBiomarker.previousValues.at(-1)?.value }},
              <span class="lowercase"> {{ $t('date') }} </span>:
              {{ currentBiomarker.previousValues.at(-1)?.date }}
            </p>
          </div>

          <div
            v-if="chartData && isNumericValue(currentBiomarker)"
            class="relative mb-8 h-290 lg:mb-0"
          >
            <div class="absolute top-0 left-0 flex h-full w-8 flex-col">
              <div class="relative flex h-full flex-col">
                <span class="text-14 text-secondary-text absolute top-[35%] left-22">
                  {{ chartData.maxValue }}
                </span>
                <span class="text-14 text-secondary-text absolute top-[68%] left-22">
                  {{ chartData.minValue }}
                </span>
              </div>

              <div class="absolute top-0 left-2 flex h-full w-8 flex-col gap-1">
                <div class="bg-light-coral rounded-2 h-1/3"></div>
                <div class="bg-jungle-green rounded-2 h-1/3"></div>
                <div class="bg-light-coral rounded-2 h-1/3"></div>
              </div>
            </div>

            <div class="border-disabled-bg relative ml-16 h-full border-t border-b">
              <div class="bg-jungle-green/20 rounded-2 absolute top-1/3 right-0 left-0 h-1/3" />

              <svg
                v-if="chartCoordinates.lines.length > 0"
                class="pointer-events-none absolute inset-0 top-0 left-0 size-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <line
                  v-for="(line, index) in chartCoordinates.lines"
                  :key="`line-${index}`"
                  :x1="line.x1"
                  :y1="line.y1"
                  :x2="line.x2"
                  :y2="line.y2"
                  stroke="rgba(26, 26, 26, 0.25)"
                  stroke-width="0.5"
                  stroke-linecap="round"
                />
              </svg>

              <template v-for="(point, index) in chartCoordinates.points" :key="`point-${index}`">
                <div
                  v-if="index === chartCoordinates.points.length - 1"
                  class="absolute h-full w-2 -translate-x-1/2"
                  :class="{
                    'bg-jungle-green': point.isInRange,
                    'bg-light-coral': !point.isInRange,
                  }"
                  :style="{ left: point.leftPercent }"
                />

                <div
                  v-if="index !== chartCoordinates.points.length - 1"
                  class="absolute -translate-x-1/2 -translate-y-1/2"
                  :style="{
                    left: point.leftPercent,
                    top: point.topPercent,
                  }"
                >
                  <BaseTooltip side="top" align="center" content-class="rounded-full">
                    <template #trigger>
                      <div
                        class="size-16 cursor-pointer rounded-full"
                        :class="{
                          'bg-jungle-green': point.isInRange,
                          'bg-light-coral': !point.isInRange,
                        }"
                      />
                    </template>
                    <template #default>
                      <span class="text-14 font-normal">{{ point.value }}</span>
                    </template>
                  </BaseTooltip>
                </div>

                <div
                  v-else
                  class="absolute size-30 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white"
                  :class="{
                    'bg-jungle-green': point.isInRange,
                    'bg-light-coral': !point.isInRange,
                  }"
                  :style="{
                    left: point.leftPercent,
                    top: point.topPercent,
                  }"
                />

                <div
                  v-if="index === chartCoordinates.points.length - 1"
                  class="text-14 border-coal/10 absolute -translate-x-1/2 transform rounded-full border bg-white px-16 py-8"
                  :class="{
                    'top-30':
                      currentBiomarker.rangeDescription.includes('Below range') ||
                      currentBiomarker.rangeDescription.includes('In range'),
                    'bottom-30': currentBiomarker.rangeDescription.includes('Above range'),
                  }"
                  :style="{ left: point.leftPercent }"
                >
                  {{ point.value }}
                </div>

                <div
                  class="text-12 text-secondary-text absolute -translate-x-1/2 text-center"
                  :class="{
                    '-bottom-33': smallerMd && index % 2 === 0,
                    '-bottom-47': smallerMd && index % 2 === 1,
                    '-bottom-40': !smallerMd,
                  }"
                  :style="{
                    left: point.leftPercent,
                  }"
                >
                  {{ point.date }}
                </div>
              </template>
            </div>
          </div>
        </div>

        <InsightsBlock
          v-if="currentBiomarker.insight && aiSettingsEnabled"
          :title="$t('biomarkerInsights')"
          :date
          :text="currentBiomarker.insight"
          class="!bg-site-bg mb-16"
        />

        <BaseAccordion
          v-if="accordionItems.length"
          :length="accordionItems.length"
          class="!mb-16"
          data-testpl="biomarker-detail-modal-accordion"
        >
          <template v-for="(item, index) in accordionItems" :key="index" #[`title-${index}`]>
            <span
              data-testpl="biomarker-detail-modal-accordion-title"
              class="lg:text-26 lg:font-secondary"
            >
              {{ item.title }}
            </span>
          </template>

          <template v-for="(item, index) in accordionItems" :key="index" #[`content-${index}`]>
            <SafeText
              :text="item.content"
              :options="messageOptions"
              class="prose mt-10"
              data-testpl="biomarker-detail-modal-accordion-content"
            />
          </template>
        </BaseAccordion>

        <BaseButton theme="outline" class="w-full lg:w-fit" @click="isOpen = false">
          {{ $t('backToMyWellness') }}
        </BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>
