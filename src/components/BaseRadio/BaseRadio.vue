<script lang="ts" setup>
import type { BaseRadioValue, BaseRadioSize } from './types';
import { RadioGroupIndicator, RadioGroupItem } from 'reka-ui';

withDefaults(
  defineProps<{
    value?: BaseRadioValue;
    size?: BaseRadioSize;
    disabled?: boolean;
  }>(),
  {
    value: null,
    size: '24',
    disabled: false,
  },
);
</script>

<template>
  <label
    class="inline-flex items-center gap-16 align-middle"
    :class="{
      'cursor-pointer': !disabled,
    }"
  >
    <RadioGroupItem
      class="data-[disabled]:!border-disabled-bg data-[state=unchecked]:border-secondary-text data-[state=checked]:border-coal outline-beige shrink-0 cursor-[inherit] overflow-hidden rounded-full border -outline-offset-1 focus-visible:outline-2"
      :class="{
        'size-24': size === '24',
      }"
      :value
      :disabled
    >
      <RadioGroupIndicator
        class="text-coal data-[disabled]:!text-disabled-bg flex h-full w-full items-center justify-center"
      >
        <span class="size-[74%] rounded-full bg-current" />
      </RadioGroupIndicator>
    </RadioGroupItem>

    <span class="grow">
      <slot />
    </span>
  </label>
</template>
