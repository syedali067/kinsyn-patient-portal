import { apiUser } from '@/api/user';
import { useToastStore } from '@/stores/toast';
import type { PaymentMethod } from '@/types/payment';
import { createSharedComposable } from '@vueuse/core';
import { set, cloneDeep } from 'lodash-es';
import { computed, ref } from 'vue';

export const usePaymentMethods = createSharedComposable(() => {
  const toastStore = useToastStore();

  const paymentMethods = ref<PaymentMethod[]>([]);

  const defaultPaymentMethod = computed(() => {
    return paymentMethods.value.find((method) => method.card.default);
  });

  const getPaymentMethods = async (cache = true) => {
    const response = cache
      ? await apiUser.getPaymentMethods()
      : await apiUser.getPaymentMethods.load();
    paymentMethods.value = response.data.value?.data.paymentMethods || [];
  };

  const createPaymentMethodLoading = ref(false);

  const createPaymentMethod = async (token: string) => {
    try {
      createPaymentMethodLoading.value = true;
      const response = await apiUser.createPaymentMethod(token);

      if (response.error.value) {
        return false;
      }

      toastStore.addToast({
        type: 'success',
        text: response.data.value?.message,
      });

      return true;
    } finally {
      createPaymentMethodLoading.value = false;
    }
  };

  const setPrimaryPaymentMethodLoading = ref(false);

  const setPrimaryPaymentMethod = async (paymentSourceId: string) => {
    try {
      setPrimaryPaymentMethodLoading.value = true;
      const response = await apiUser.setPrimaryPaymentMethod({ paymentSourceId });

      if (response.error.value) {
        throw new Error(response.error.value);
      }

      await apiUser.getPaymentMethods.load();

      toastStore.addToast({
        type: 'success',
        text: response.data.value?.message,
      });
    } finally {
      setPrimaryPaymentMethodLoading.value = false;
    }
  };

  const setPrimaryPaymentMethodImmediately = async (paymentSourceId: string) => {
    const previousPaymentMethods = cloneDeep(paymentMethods.value);

    paymentMethods.value = paymentMethods.value.map((method) => {
      return set(method, 'card.default', paymentSourceId === method.externalRef);
    });

    try {
      await setPrimaryPaymentMethod(paymentSourceId);
    } catch {
      paymentMethods.value = previousPaymentMethods;
    }
  };

  const deletePaymentMethodLoading = ref(false);

  const deletePaymentMethod = async (paymentSourceId: string) => {
    try {
      deletePaymentMethodLoading.value = true;
      const response = await apiUser.deletePaymentMethod({ paymentSourceId });

      if (response.error.value) {
        throw new Error(response.error.value);
      }

      await apiUser.getPaymentMethods.load();

      toastStore.addToast({
        type: 'success',
        text: response.data.value?.message,
      });
    } finally {
      deletePaymentMethodLoading.value = false;
    }
  };

  const deletePaymentMethodImmediately = async (paymentSourceId: string) => {
    const previousPaymentMethods = cloneDeep(paymentMethods.value);

    paymentMethods.value = paymentMethods.value.filter((method) => {
      return paymentSourceId !== method.externalRef;
    });

    try {
      await deletePaymentMethod(paymentSourceId);
    } catch {
      paymentMethods.value = previousPaymentMethods;
    }
  };

  return {
    paymentMethods,
    defaultPaymentMethod,
    getPaymentMethods,
    createPaymentMethod,
    createPaymentMethodLoading,
    setPrimaryPaymentMethod,
    setPrimaryPaymentMethodLoading,
    setPrimaryPaymentMethodImmediately,
    deletePaymentMethod,
    deletePaymentMethodLoading,
    deletePaymentMethodImmediately,
  };
});
