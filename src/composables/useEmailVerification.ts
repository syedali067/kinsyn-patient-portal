import { apiUser } from '@/api/user';
import {
  EMAIL_VERIFICATION_CODE_SECONDS_DELAY,
  EMAIL_VERIFICATION_CODE_SECONDS_INTERVAL,
} from '@/constants/emailVerification';
import { useToastStore } from '@/stores/toast';
import { useCountdown } from '@vueuse/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useEmailVerification = () => {
  const { t } = useI18n();
  const isEmailVerificationAlreadySent = ref(false);
  const sendEmailVerificationLoading = ref(false);
  const canSendEmailVerification = ref(true);
  const toastStore = useToastStore();

  const { remaining, start, stop } = useCountdown(EMAIL_VERIFICATION_CODE_SECONDS_DELAY, {
    interval: EMAIL_VERIFICATION_CODE_SECONDS_INTERVAL,
    immediate: false,
    onComplete: () => {
      canSendEmailVerification.value = true;
    },
  });

  const startTimer = () => {
    isEmailVerificationAlreadySent.value = true;
    canSendEmailVerification.value = false;
    start();
  };

  const sendEmailVerification = async (email: string | null, name?: string) => {
    if (!canSendEmailVerification.value || !email) {
      return false;
    }

    try {
      sendEmailVerificationLoading.value = true;
      const response = await apiUser.sendEmailVerification(email, name);

      if (response.statusCode.value === 400) {
        startTimer();
        return false;
      }

      if (response.statusCode.value !== 200 && response.statusCode.value !== 409) {
        toastStore.addToast({
          type: 'error',
          text: t('somethingWentWrongWhileSendingTheEmailVerificationCode'),
        });
        return false;
      }

      if (response.statusCode.value === 409) {
        toastStore.addToast({
          type: 'error',
          text: t('emailAddressAlreadyRegistered'),
        });
        return false;
      }

      startTimer();
      return true;
    } finally {
      sendEmailVerificationLoading.value = false;
    }
  };

  const cleanup = () => {
    stop();
  };

  return {
    sendEmailVerification,
    sendEmailVerificationLoading,
    isEmailVerificationAlreadySent,
    canSendEmailVerification,
    remaining,
    cleanup,
    startTimer,
  };
};
