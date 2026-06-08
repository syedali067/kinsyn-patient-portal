<script setup lang="ts">
import ToastItem from './components/ToastItem.vue';
import { useToastStore } from '@/stores/toast';
import { ToastProvider, ToastViewport } from 'reka-ui';

const toastStore = useToastStore();
</script>

<template>
  <ToastProvider :duration="toastStore.defaultDuration">
    <ToastViewport
      class="pointer-events-none fixed top-0 left-0 z-10000 flex w-full flex-col-reverse items-center gap-8 p-16 lg:p-24"
    />

    <ToastItem
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      :toast
      class="pointer-events-auto"
      @close="toastStore.removeToast(toast.id)"
    />
  </ToastProvider>
</template>
