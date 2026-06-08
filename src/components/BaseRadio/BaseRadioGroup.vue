<script lang="ts" setup>
import type { BaseRadioValue } from './types';
import { RadioGroupRoot } from 'reka-ui';

withDefaults(
  defineProps<{
    as?: string;
    disabled?: boolean;
  }>(),
  {
    as: 'div',
    disabled: false,
  },
);

const valueModel = defineModel<BaseRadioValue>({ default: null });
</script>

<template>
  <RadioGroupRoot v-model="valueModel" :as :disabled>
    <slot />
  </RadioGroupRoot>
</template>
