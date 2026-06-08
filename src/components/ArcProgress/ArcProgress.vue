<script lang="ts" setup>
import type { ArcProgressTheme, ArcProgressType } from './types';
import { TransitionPresets, useTransition } from '@vueuse/core';
import { computed, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    progress: number | number[];
    customProgress?: number;
    label?: string;
    theme?: ArcProgressTheme;
    duration?: number;
    withPercent?: boolean;
    type?: ArcProgressType;
  }>(),
  {
    theme: 'dark',
    duration: 800,
    withPercent: false,
    type: 'arc',
  },
);

const arrayedValue = computed(() =>
  Array.isArray(props.progress) ? props.progress : [props.progress],
);

const animatedRef = ref<number[]>(arrayedValue.value.map(() => 0));

const animatedValue = useTransition(animatedRef, {
  duration: props.duration,
  transition: TransitionPresets.easeInOutQuad,
});

const dashOffsetForArc = computed(() => animatedValue.value.map((p) => 521.5 * ((100 - p) / 100)));
const dashOffsetForCircle = computed(() =>
  animatedValue.value.map((p) => 873.07 * ((100 - p) / 100)),
);

const getProgressOpacity = (index: number) =>
  (100 - (100 / arrayedValue.value.length) * index) / 100;

const arcStrokeClasses = computed(() => {
  switch (props.theme) {
    case 'light':
      return {
        back: 'stroke-bone',
        progress: 'stroke-stone',
        textClasses: 'text-stone',
      };

    case 'dark':
    default:
      return {
        back: 'stroke-coal/75',
        progress: 'stroke-white',
        textClasses: 'text-white',
      };
  }
});

const getAngle = (values: number[], type: ArcProgressType) => {
  let acc = 0;
  return values.map((p) => {
    const angle = acc * (type === 'circle' ? 3.6 : 1.8);
    acc += p;
    return angle;
  });
};

const anglesForCircle = computed(() => getAngle(arrayedValue.value, 'circle'));
const anglesForArc = computed(() => getAngle(arrayedValue.value, 'arc'));

const resultValue = computed(() => {
  if (props.customProgress) {
    return props.customProgress;
  }

  return Math.floor(
    Array.isArray(props.progress)
      ? animatedValue.value.reduce((a, b) => a + b, 0)
      : (animatedValue.value[0] ?? 0),
  );
});

watch(
  () => arrayedValue.value,
  (newVal) => {
    animatedRef.value = newVal;
  },
  { immediate: true },
);
</script>

<template>
  <div class="relative flex w-full justify-center" data-testpl="arc-progress">
    <template v-if="type === 'arc'">
      <svg width="344" height="172" viewBox="0 0 344 172" data-testpl="arc-progress-svg">
        <path
          v-if="arrayedValue.length === 1"
          :class="arcStrokeClasses.back"
          d="M 172 172 m -166 0 a 166 166 0 1 1 332 0"
          stroke-width="12"
          fill="none"
        />

        <path
          v-for="(offset, i) in dashOffsetForArc"
          :key="i"
          :class="arcStrokeClasses.progress"
          :style="{
            opacity: getProgressOpacity(i),
            transform: `rotate(${anglesForArc[i]}deg)`,
          }"
          d="M 172 172 m -166 0 a 166 166 0 1 1 332 0"
          stroke-width="12"
          fill="none"
          stroke-dasharray="521.5"
          :stroke-dashoffset="offset"
        />
      </svg>
    </template>

    <template v-if="type === 'circle'">
      <svg
        class="-rotate-90"
        width="298"
        height="298"
        viewBox="0 0 298 298"
        data-testpl="circle-progress-svg"
      >
        <circle
          v-if="arrayedValue.length === 1"
          :class="arcStrokeClasses.back"
          r="139"
          cx="149"
          cy="149"
          fill="transparent"
          stroke-width="20"
        />

        <circle
          v-for="(offset, i) in dashOffsetForCircle"
          :key="i"
          :class="[arcStrokeClasses.progress, 'origin-center']"
          :style="{
            opacity: getProgressOpacity(i),
            transform: `rotate(${anglesForCircle[i]}deg)`,
          }"
          r="139"
          cx="149"
          cy="149"
          fill="transparent"
          stroke-width="20"
          stroke-dasharray="873.07"
          :stroke-dashoffset="offset"
        />
      </svg>
    </template>

    <span
      class="absolute left-1/2 flex -translate-x-1/2 flex-col items-center"
      :class="[
        arcStrokeClasses.textClasses,
        {
          'bottom-0': type === 'arc',
          'top-1/2 -translate-y-1/2': type === 'circle',
        },
      ]"
      data-testpl="arc-progress-value"
    >
      <span v-if="label" class="text-18">
        {{ label }}
      </span>

      <span class="text-96 font-secondary"> {{ resultValue }}{{ withPercent ? '%' : '' }} </span>
    </span>
  </div>
</template>
