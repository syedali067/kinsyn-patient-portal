<script lang="ts" setup>
import type { BaseCheckboxValue } from './types';
import { CheckboxGroupRoot } from 'reka-ui';

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

const valueModel = defineModel<BaseCheckboxValue[]>({ default: [] });
</script>

<template>
  <CheckboxGroupRoot v-model="valueModel" :as :disabled>
    <slot />
  </CheckboxGroupRoot>
</template>
