<script setup lang="ts">
import type { BasePopoverSide, BasePopoverAlign } from './types';
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui';

withDefaults(
  defineProps<{
    align?: BasePopoverAlign;
    side?: BasePopoverSide;
    sideOffset?: number;
    collisionPadding?: number;
  }>(),
  {
    align: 'center',
    side: 'bottom',
    sideOffset: 8,
    collisionPadding: 24,
  },
);

const isOpen = defineModel<boolean>('open');
const close = () => (isOpen.value = false);
</script>

<template>
  <PopoverRoot v-model:open="isOpen">
    <PopoverTrigger as-child>
      <slot name="trigger" :open="isOpen" />
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent
        :align
        :side
        :side-offset
        :collision-padding
        class="rounded-8 border-bone z-9999 border bg-white shadow-sm data-[state=closed]:animate-[fadeOut_0.2s] data-[state=open]:animate-[fadeIn_0.2s]"
        @open-auto-focus.prevent
      >
        <slot name="content" :close="close" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
