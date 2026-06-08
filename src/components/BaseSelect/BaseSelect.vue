<script setup lang="ts">
import type { BaseSelectOption, BaseSelectSize } from './types';
import IconChevron from '@/assets/icons/chevron-down.svg?component';
import BaseSpinner from '@/components/BaseSpinner/BaseSpinner.vue';
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectViewport,
  SelectValue,
} from 'reka-ui';
import { computed, type Ref, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    options?: BaseSelectOption[];
    error?: string | Ref<string>;
    size?: BaseSelectSize;
    disabled?: boolean;
    by?: string;
    loading?: boolean;
    dataTestpl?: string;
  }>(),
  {
    placeholder: '',
    options: () => [],
    error: '',
    size: '48',
    disabled: false,
    by: 'value',
    dataTestpl: 'base-select',
  },
);

const valueModel = defineModel<string | number>({ default: '' });

const focused = ref(false);

const sizeClass = computed(() => ({
  'h-48': props.size === '48',
}));
</script>

<template>
  <SelectRoot v-model="valueModel" :disabled="disabled || loading" :by>
    <div class="flex flex-col gap-8" :data-testpl="dataTestpl">
      <SelectTrigger
        data-testpl="base-select-trigger"
        class="text-coal text-14 rounded-4 relative inline-flex w-full min-w-160 items-center justify-between px-16 leading-none -outline-offset-1"
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
        @focus="focused = true"
        @blur="focused = false"
      >
        <span
          data-testpl="base-select-placeholder"
          class="pointer-events-none absolute top-0 left-16 flex h-full items-center whitespace-nowrap"
          :class="{
            'pointer-events-none opacity-0': loading,
          }"
        >
          <span
            class="origin-top-left"
            :class="{
              '-translate-y-8 scale-70': valueModel || focused,
              'text-secondary-text': !error && !disabled,
              'text-error': error,
              'text-disabled-text': disabled,
            }"
          >
            {{ placeholder }}
          </span>
        </span>

        <SelectValue
          data-testpl="base-select-value"
          class="translate-y-8"
          :class="{
            'text-disabled-text': disabled,
            'pointer-events-none opacity-0': loading,
          }"
        >
          {{ options.find((item) => item[by] === valueModel)?.label }}
        </SelectValue>

        <IconChevron
          data-testpl="base-select-icon"
          class="size-24 shrink-0"
          :class="{
            'text-disabled-text': disabled,
            'pointer-events-none opacity-0': loading,
          }"
        />

        <span
          v-if="loading"
          data-testpl="base-select-loader"
          class="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <BaseSpinner class="size-20" />
        </span>
      </SelectTrigger>

      <p v-if="error" data-testpl="base-select-error" class="text-error text-12">
        {{ error }}
      </p>
    </div>

    <SelectPortal>
      <SelectContent
        data-testpl="base-select-content"
        class="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade rounded-8 z-10000 max-h-300 min-w-160 overflow-y-auto bg-white shadow-sm will-change-[opacity,transform]"
        :side-offset="8"
        side="bottom"
        position="popper"
        :body-lock="false"
      >
        <slot name="aboveContent" />
        <SelectViewport class="px-8 py-12">
          <SelectGroup>
            <SelectItem
              v-for="(option, index) in options"
              :key="index"
              data-testpl="base-select-item"
              class="text-14 hover:bg-bone/50 rounded-4 cursor-pointer px-16 py-12"
              :value="option[by] as string"
            >
              <SelectItemText>
                {{ option.label }}
              </SelectItemText>
            </SelectItem>
          </SelectGroup>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
