<script setup lang="ts">
import type { BaseCounterSize } from './types';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    size?: BaseCounterSize;
  }>(),
  {
    size: '24',
  },
);

const model = defineModel<number>();

const displayValue = computed(() => Math.max(model?.value || 0, 0));

const sizeClass = computed(() => ({
  'h-16 min-w-16 px-4 text-10': props.size === '16',
  'h-24 min-w-24 px-6 text-14': props.size === '24',
}));
</script>

<template>
  <span
    v-if="model"
    class="bg-coal inline-flex items-center justify-center rounded-full align-middle leading-none font-bold text-white"
    :class="sizeClass"
    data-testpl="base-counter"
  >
    {{ displayValue }}
  </span>
</template>
