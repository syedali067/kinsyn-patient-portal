import type { Toast, ToastOptions } from '@/types/toast';
import { uniqueId } from 'lodash-es';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([]);
  const maxToasts = 2;
  const defaultDuration = 5000;

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  const addToast = (toast: ToastOptions) => {
    if (toasts.value.length >= maxToasts) {
      toasts.value.shift();
    }

    const newToast: Toast = {
      id: uniqueId(`toast_${Date.now()}`),
      type: toast.type ?? 'error',
      text: toast.text ?? '',
      duration: toast.duration ?? defaultDuration,
      closeBtn: toast.closeBtn !== undefined ? toast.closeBtn : true,
      displayError: toast.displayError !== undefined ? toast.displayError : true,
    };

    if (newToast.displayError) {
      toasts.value.push(newToast);
    }
  };

  return {
    toasts,
    addToast,
    removeToast,
    defaultDuration,
  };
});
