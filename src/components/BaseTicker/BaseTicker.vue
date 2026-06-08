<script setup lang="ts">
import IconMinus from '@/assets/icons/minus.svg?component';
import IconPlus from '@/assets/icons/plus.svg?component';
import IconTrash from '@/assets/icons/trash.svg?component';
import BaseSpinner from '@/components/BaseSpinner/BaseSpinner.vue';
import {
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot,
} from 'reka-ui';
import { computed } from 'vue';

withDefaults(
  defineProps<{
    min?: number;
    max?: number;
    disabled?: boolean;
    loading?: boolean;
    dataTestpl?: string;
    dataTestpls?: {
      delete?: string;
      decrement?: string;
      increment?: string;
      input?: string;
    };
  }>(),
  {
    min: 0,
    dataTestpl: 'base-ticker',
    dataTestpls: () => ({
      delete: 'base-ticker-delete',
      decrement: 'base-ticker-decrement',
      increment: 'base-ticker-increment',
      input: 'base-ticker-input',
    }),
  },
);

const value = defineModel<number>({ default: 1 });

const inputWidthVar = computed(() => {
  return Number.isFinite(value.value) && value.value! > 9
    ? `${String(value.value).length + 1}ch`
    : '2ch';
});

const isDeleteMode = computed(() => value.value === 1 || value.value === -1);
</script>

<template>
  <NumberFieldRoot
    v-model="value"
    class="base-ticker"
    :data-testpl="dataTestpl"
    :class="{ 'base-ticker--loading': loading }"
    :default-value="value"
    :disabled
    :min
    :max
    :focus-on-change="false"
  >
    <NumberFieldDecrement
      class="disabled:text-disabled-text p-2"
      :data-testpl="dataTestpls?.decrement"
    >
      <IconTrash v-if="isDeleteMode" class="size-20" :data-testpl="dataTestpls?.delete" />
      <IconMinus v-else class="size-20" />
    </NumberFieldDecrement>

    <NumberFieldInput class="base-ticker-input" :data-testpl="dataTestpls?.input" />

    <NumberFieldIncrement
      class="disabled:text-disabled-text p-2"
      :data-testpl="dataTestpls?.increment"
    >
      <IconPlus class="size-20" />
    </NumberFieldIncrement>

    <span
      v-show="loading"
      class="loader pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <BaseSpinner class="size-20" />
    </span>
  </NumberFieldRoot>
</template>

<style scoped>
@reference '@/assets/css/main.css';

.base-ticker {
  @apply text-coal rounded-4 focus-within:outline-beige border-ash relative inline-flex h-48 w-min items-center gap-12 border p-12 align-middle -outline-offset-1 focus-within:outline-2;
}

.base-ticker[data-disabled] {
  @apply border-disabled-bg bg-disabled-bg text-disabled-text cursor-default;
}

.base-ticker--loading {
  @apply cursor-wait;
}

.base-ticker--loading > *:not(.loader) {
  @apply pointer-events-none opacity-0;
}

.base-ticker-input {
  @apply text-center tabular-nums outline-0;
  width: v-bind(inputWidthVar);
}
</style>
