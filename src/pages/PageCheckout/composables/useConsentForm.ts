import { useUserStore } from '@/stores/user';
import { createSharedComposable } from '@vueuse/core';
import { ref } from 'vue';

export const useConsentForm = createSharedComposable(() => {
  const userStore = useUserStore();

  const agreeToAuthorizeForm = ref({
    agreeToAuthorize: userStore.profile?.user.consentEmailPersonalizedHealth ?? false,
  });

  const marketingForm = ref({
    consentEmailGeneralMarketing: userStore.profile?.user.consentEmailGeneralMarketing ?? false,
    consentSmsMarketing: userStore.profile?.user.consentSmsMarketing ?? false,
  });

  return {
    agreeToAuthorizeForm,
    marketingForm,
  };
});
