<script setup lang="ts">
import type { BaseDialogPosition } from './types';
import IconClose from '@/assets/icons/close.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui';
import { watch } from 'vue';

defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    position?: BaseDialogPosition;
    closeBtn?: boolean;
    dataTestpls?: {
      header?: string;
      closeBtn?: string;
      content?: string;
      footer?: string;
    };
  }>(),
  {
    position: 'center',
    closeBtn: true,
    dataTestpls: () => ({
      header: 'base-dialog-header',
      closeBtn: 'base-dialog-close-btn',
      content: 'base-dialog-content',
      footer: 'base-dialog-footer',
    }),
  },
);

const emits = defineEmits<{
  open: [];
  close: [];
}>();

const isOpen = defineModel<boolean>('open');

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

watch(isOpen, (value) => {
  if (value) {
    emits('open');
  } else {
    emits('close');
  }
});
</script>

<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay
        class="bg-coal/60 fixed inset-0 z-9999 data-[state=closed]:animate-[fadeOut_0.3s] data-[state=open]:animate-[fadeIn_0.3s]"
      />

      <DialogContent
        v-bind="$attrs"
        class="fixed z-9999 flex w-full min-w-full flex-col overflow-hidden bg-white shadow-lg outline-none lg:min-w-auto"
        :class="{
          'lg:rounded-8 top-1/2 left-1/2 max-h-full -translate-1/2 data-[state=closed]:animate-[zoomOut_0.3s] data-[state=open]:animate-[zoomIn_0.3s]':
            position === 'center',
          'top-0 right-0 bottom-0 max-h-full data-[state=closed]:animate-[slideOutRight_0.3s] data-[state=open]:animate-[slideInRight_0.3s]':
            position === 'right',
          'rounded-tl-8 rounded-tr-8 right-0 bottom-0 left-0 max-h-[calc(100%-64px)] data-[state=closed]:animate-[slideOutDown_0.3s] data-[state=open]:animate-[slideInUp_0.3s] lg:max-h-[calc(100%-112px)]':
            position === 'bottom',
        }"
      >
        <div class="flex h-full flex-col overflow-y-auto">
          <DialogTitle
            v-if="$slots.header || closeBtn"
            as="header"
            class="text-26 font-secondary sticky top-0 z-1 flex items-center justify-between gap-16 bg-linear-to-b from-white from-80% p-16 lg:p-24"
            :data-testpl="dataTestpls.header"
          >
            <slot name="header" />

            <DialogClose as-child class="ml-auto" :data-testpl="dataTestpls.closeBtn">
              <BaseButton
                v-if="closeBtn"
                :size="greaterOrEqualLg ? '40' : '32'"
                color="gray"
                rounded
                class="shrink-0"
                @click="isOpen = false"
              >
                <template #prepend>
                  <IconClose class="size-20" />
                </template>
              </BaseButton>
            </DialogClose>
          </DialogTitle>

          <div
            class="grow p-16 not-first:-mt-16 lg:p-24 lg:not-first:-mt-24"
            :data-testpl="dataTestpls.content"
          >
            <slot name="content" />
          </div>

          <div
            v-if="$slots.footer"
            class="mt-auto p-16 not-first:-mt-16 lg:p-24 lg:not-first:-mt-24"
            :data-testpl="dataTestpls.footer"
          >
            <slot name="footer" />
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
