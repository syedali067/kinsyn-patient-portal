<script lang="ts" setup>
import type { BaseCheckboxValue, BaseCheckboxSize } from './types';
import IconCheckAlternate from '@/assets/icons/check-alternate.svg?component';
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui';
import type { Ref } from 'vue';

withDefaults(
  defineProps<{
    value?: BaseCheckboxValue;
    size?: BaseCheckboxSize;
    disabled?: boolean;
    error?: string | Ref<string>;
  }>(),
  {
    value: null,
    size: '24',
    disabled: false,
    error: '',
  },
);

const valueModel = defineModel<boolean>({ default: false });
</script>

<template>
  <label
    class="inline-flex items-center gap-16 align-middle"
    :class="{
      'cursor-pointer': !disabled,
      'disabled:cursor-default': disabled,
    }"
    data-testpl="base-checkbox"
  >
    <CheckboxRoot
      v-model="valueModel"
      class="rounded-4 outline-beige data-[disabled]:!border-disabled-bg data-[state=unchecked]:border-secondary-text data-[state=checked]:border-coal shrink-0 cursor-[inherit] self-start overflow-hidden border -outline-offset-1 focus-visible:outline-2"
      :class="{
        'size-24': size === '24',
        'border-secondary-text': !disabled && !valueModel,
        'border-coal': !disabled && valueModel,
        'border-disabled-bg': disabled,
      }"
      :value
      :disabled
    >
      <CheckboxIndicator
        class="data-[disabled]:!text-disabled-bg bg-coal flex h-full w-full items-center justify-center text-white data-[disabled]:!bg-transparent"
        data-testpl="base-checkbox-indicator"
      >
        <IconCheckAlternate class="-mx-1" />
      </CheckboxIndicator>
    </CheckboxRoot>

    <span
      class="grow"
      data-testpl="base-checkbox-slot"
      :class="{
        '[&>*]:!text-error': error,
      }"
    >
      <slot />
    </span>
  </label>
</template>
