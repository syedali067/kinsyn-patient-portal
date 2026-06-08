<script setup lang="ts">
import IconCheckCircle from '@/assets/icons/check-circle.svg?component';
import IconCloseCircle from '@/assets/icons/close-circle.svg?component';
import IconClose from '@/assets/icons/close.svg?component';
import type { Toast } from '@/types/toast';
import { ToastRoot, ToastTitle, ToastAction } from 'reka-ui';
import { computed } from 'vue';

const props = defineProps<{
  toast: Toast;
}>();

const emit = defineEmits<{
  close: [];
}>();

const toastIcon = computed(() => {
  switch (props.toast.type) {
    case 'success':
      return {
        icon: IconCheckCircle,
        color: 'text-beige',
      };
    case 'error':
      return {
        icon: IconCloseCircle,
        color: 'text-error',
      };
    case 'neutral':
      return undefined;
    default:
      return undefined;
  }
});
</script>

<template>
  <ToastRoot
    :duration="toast.duration"
    class="rounded-4 flex max-w-400 items-center gap-8 bg-white p-12 shadow-sm data-[state=open]:animate-[zoomIn_0.3s]"
  >
    <component
      :is="toastIcon.icon"
      v-if="toastIcon?.icon"
      class="size-20 shrink-0"
      :class="toastIcon.color"
    />

    <ToastTitle class="text-14">
      {{ toast.text }}
    </ToastTitle>

    <ToastAction
      v-if="toast.closeBtn"
      class="hover:text-error ml-16 shrink-0 transition-colors"
      alt-text="Close message"
      @click="emit('close')"
    >
      <IconClose class="size-16" />
    </ToastAction>
  </ToastRoot>
</template>
