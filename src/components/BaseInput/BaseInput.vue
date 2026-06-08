<script lang="ts" setup>
import type { BaseInputType, BaseInputSize, BaseInputMode } from './types';
import { computed, ref, type Ref } from 'vue';

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    type?: BaseInputType;
    disabled?: boolean;
    error?: string | Ref<string>;
    size?: BaseInputSize;
    animatedPlaceholder?: boolean;
    autofocus?: boolean;
    name?: string;
    autocomplete?: string;
    dataTestpl?: string;
    inputmode?: BaseInputMode;
  }>(),
  {
    placeholder: '',
    type: 'text',
    disabled: false,
    error: '',
    size: '48',
    animatedPlaceholder: true,
    autofocus: false,
    name: undefined,
    autocomplete: undefined,
    dataTestpl: undefined,
    inputmode: undefined,
  },
);

const valueModel = defineModel<string>({ default: '' });
const focused = ref(false);
const input = ref<HTMLInputElement | null>(null);

const sizeClass = computed(() => ({
  'h-48': props.size === '48',
}));

const filled = computed(() => !!valueModel.value);

defineExpose({
  input,
});
</script>

<template>
  <div class="flex flex-col gap-8" data-testpl="base-input-wrapper">
    <label
      class="rounded-4 inline-flex cursor-text items-center gap-16 px-16 align-middle -outline-offset-1"
      :class="[
        sizeClass,
        {
          'border-error border': error,
          'border-ash border': !error,
          'outline-error outline-2': focused && error,
          'outline-beige outline-2': focused && !error,
          'bg-disabled-bg': disabled,
        },
      ]"
      data-testpl="base-input-label"
    >
      <span v-if="$slots.prepend" class="shrink-0">
        <slot name="prepend" />
      </span>

      <span class="relative flex h-full w-full items-center">
        <span class="pointer-events-none absolute inset-0 flex items-center">
          <span
            class="text-14 whitespace-nowrap"
            :class="{
              hidden: (focused || filled) && !animatedPlaceholder,
              'origin-top-left transition-transform': animatedPlaceholder,
              '-translate-y-8 scale-70': (filled || focused) && animatedPlaceholder,
              'text-secondary-text': !error && !disabled,
              'text-error': error,
              'text-disabled-text': disabled,
            }"
            data-testpl="base-input-placeholder"
          >
            {{ placeholder }}
          </span>
        </span>

        <input
          v-model="valueModel"
          ref="input"
          class="text-14 text-coal block w-full outline-none placeholder:text-transparent"
          :class="{
            'text-disabled-text': disabled,
            'translate-y-8': animatedPlaceholder,
          }"
          :type
          :disabled
          :autofocus
          :name
          :autocomplete
          :data-testpl
          :inputmode
          @focus="focused = true"
          @blur="focused = false"
        />
      </span>

      <span v-if="$slots.append" class="shrink-0">
        <slot name="append" />
      </span>
    </label>

    <p v-if="error" class="text-error text-12" data-testpl="base-input-error">
      {{ error }}
    </p>
  </div>
</template>
