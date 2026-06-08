<script setup lang="ts">
import type { BaseTooltipAlign, BaseTooltipSide } from './types';
import { ANIMATION_DELAY } from '@/utils/constants';
import { onClickOutside } from '@vueuse/core';
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui';
import { ref } from 'vue';

withDefaults(
  defineProps<{
    align?: BaseTooltipAlign;
    side?: BaseTooltipSide;
    sideOffset?: number;
    contentClass?: string;
    collisionPadding?: number;
  }>(),
  {
    align: 'start',
    side: 'right',
    sideOffset: 8,
    contentClass: '',
    collisionPadding: 16,
  },
);

const open = ref(false);
const tooltipContentRef = ref<HTMLElement | null>(null);

const toggleTooltip = () => {
  open.value = !open.value;
};

onClickOutside(tooltipContentRef, () => {
  open.value = false;
});
</script>

<template>
  <TooltipProvider disable-closing-trigger :delay-duration="ANIMATION_DELAY">
    <TooltipRoot v-model:open="open">
      <TooltipTrigger type="button" @touchstart.prevent="toggleTooltip">
        <slot name="trigger" />
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent
          ref="tooltipContentRef"
          :align="align"
          :side="side"
          :side-offset="sideOffset"
          :arrow-padding="16"
          avoid-collisions
          :collision-padding="collisionPadding"
          sticky="partial"
          update-position-strategy="optimized"
          class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade rounded-4 text-12 z-9999 max-w-[90vw] bg-white px-16 py-8 font-medium shadow-sm will-change-[transform,opacity] select-none"
          :class="contentClass"
          @pointerdown.stop
          @touchstart.stop
        >
          <slot />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
