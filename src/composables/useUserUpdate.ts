import { apiUser } from '@/api/user';
import type { AddressPayload, AddressType, UserUpdatePayload } from '@/api/user/types.ts';
import { useToastStore } from '@/stores/toast';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';

export const useUserUpdate = () => {
  const toastStore = useToastStore();
  const userStore = useUserStore();

  const updateProfileLoading = ref(false);
  const updateAddressLoading = ref(false);

  const updateProfile = async (id: number, payload: UserUpdatePayload) => {
    try {
      updateProfileLoading.value = true;

      const response = await apiUser.updateProfile(payload);

      if (response.statusCode.value !== 200) {
        return;
      }

      toastStore.addToast({
        type: 'success',
        text: response.data.value?.message,
      });

      return response.data.value?.data;
    } finally {
      updateProfileLoading.value = false;
    }
  };

  const updateAddress = async (payload: AddressPayload, type: AddressType) => {
    if (!payload || !type) return false;

    try {
      updateAddressLoading.value = true;

      if (type === 'shipping' && userStore.addresses?.shippingAddress?.id) {
        payload.addressId = userStore.addresses?.shippingAddress?.id;
      }

      if (type === 'billing' && userStore.addresses?.billingAddress?.id) {
        payload.addressId = userStore.addresses?.billingAddress?.id;
      }

      const response = await apiUser.postAddress(payload);

      if (response.statusCode.value !== 200) {
        return false;
      }

      toastStore.addToast({
        type: 'success',
        text: response.data.value?.message,
      });

      await userStore.getProfile(false);

      return true;
    } finally {
      updateAddressLoading.value = false;
    }
  };

  return {
    updateProfile,
    updateProfileLoading,
    updateAddress,
    updateAddressLoading,
  };
};
