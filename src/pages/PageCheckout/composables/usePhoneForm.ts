import { useAddressForm } from './useAddressForm';
import { useValidator } from '@/composables/useValidator';
import { useUserStore } from '@/stores/user';
import { useVuelidate } from '@vuelidate/core';
import { createSharedComposable } from '@vueuse/core';
import { computed, ref } from 'vue';

export const usePhoneForm = createSharedComposable(() => {
  const userStore = useUserStore();
  const { shippingAddressForm } = useAddressForm();
  const { phoneRules } = useValidator();

  const phoneFormRules = computed(() => ({
    phone: phoneRules,
  }));

  const phoneValidation = useVuelidate(phoneFormRules, shippingAddressForm, {
    $scope: false,
  });

  const consentForm = ref({
    consentSmsTransactional: userStore.profile?.user.consentSmsTransactional ?? false,
  });

  return {
    phoneValidation,
    consentForm,
  };
});
