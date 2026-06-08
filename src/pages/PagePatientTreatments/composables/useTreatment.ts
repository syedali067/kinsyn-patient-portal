import { apiChargebee } from '@/api/chargebee';
import type { BeRightBackPayload } from '@/api/chargebee/types';
import { apiTreatment } from '@/api/treatment';
import { useToastStore } from '@/stores/toast';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useTreatment = () => {
  const { t } = useI18n();
  const toastStore = useToastStore();

  const modifyTreatmentLoading = ref(false);
  const cancelTreatmentLoading = ref(false);
  const removeAddonLoading = ref(false);

  const modifyTreatment = async (treatmentId: number, modifyText: string) => {
    try {
      modifyTreatmentLoading.value = true;

      const response = await apiTreatment.modifyTreatment({
        treatmentId,
        modifyText,
      });

      if (response.statusCode.value !== 200) {
        return false;
      }

      toastStore.addToast({
        type: 'success',
        text: response.data.value?.message,
      });

      return true;
    } finally {
      modifyTreatmentLoading.value = false;
    }
  };

  const cancelTreatmentManually = async (treatmentId: number) => {
    const response = await apiTreatment.cancelTreatment(treatmentId);

    if (response.statusCode.value !== 200) {
      return false;
    }

    toastStore.addToast({
      type: 'success',
      text: response.data.value?.message,
    });

    return true;
  };

  const cancelTreatment = async (treatmentId: number, email: string, userId: number) => {
    try {
      cancelTreatmentLoading.value = true;

      const retentionAppId = import.meta.env.VITE_CHARGEBEE_RETENTION_APP_ID;
      /* Use retention only if env is set */
      if (retentionAppId) {
        try {
          const response = await apiTreatment.getRetentionKey(treatmentId);

          if (response.statusCode.value !== 200) {
            return await cancelTreatmentManually(treatmentId);
          }

          const retentionKey = response.data.value?.data.key;
          const subscriptionRef = response.data.value?.data.subscriptionRef;

          toastStore.addToast({
            type: 'neutral',
            text: `${t('redirecting')}...`,
          });

          const payload: BeRightBackPayload = {
            app_id: import.meta.env.VITE_CHARGEBEE_RETENTION_APP_ID,
            email,
            account: {
              internal_id: userId.toString() ?? '',
            },
            subscription_id: subscriptionRef,
            save_return_url: window.location.href,
            cancel_confirmation_url: `${
              window.location.origin
            }/api/v1/retention/cancel?key=${retentionKey}`,
            custom: {
              offer_accept_url: `${
                window.location.origin
              }/api/v1/retention/accept-offer?key=${retentionKey}`,
            },
            context: {
              locale: navigator.language,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              user_agent: navigator.userAgent,
              url: window.location.href,
              referrer: document.referrer,
            },
            timestamp: new Date().toISOString(),
          };

          const brbRes = await apiChargebee.getBeRightBack(payload);

          if (brbRes.data.value?.url) {
            window.location.href = brbRes.data.value.url;
            return true;
          } else {
            /* We must allow users to cancel even if there is a problem with the Chargebee Retention app. */
            return await cancelTreatmentManually(treatmentId);
          }
        } catch (e) {
          console.error(e);
          throw new Error('Error with Chargebee retention');
        }
        /* No retention set? Just cancel manually. */
      } else {
        return await cancelTreatmentManually(treatmentId);
      }
    } finally {
      cancelTreatmentLoading.value = false;
    }
  };

  const removeAddon = async (treatmentId: number, addonRef: string) => {
    try {
      removeAddonLoading.value = true;

      const response = await apiTreatment.removeAddon({
        treatmentId,
        addonRef,
      });

      if (response.statusCode.value !== 200) {
        return false;
      }

      toastStore.addToast({
        type: 'success',
        text: t('addonRemoveRequestSent'),
      });

      return true;
    } finally {
      removeAddonLoading.value = false;
    }
  };

  return {
    modifyTreatment,
    modifyTreatmentLoading,
    cancelTreatment,
    cancelTreatmentLoading,
    removeAddon,
    removeAddonLoading,
  };
};
