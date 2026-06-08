import { apiTreatment } from '@/api/treatment';
import { useToastStore } from '@/stores/toast';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useTreatments = () => {
  const { t } = useI18n();
  const toastStore = useToastStore();

  const reActivateSubscriptionsLoading = ref(false);

  const reActivateSubscriptions = async (treatmentId: number, toRemove?: number[]) => {
    try {
      reActivateSubscriptionsLoading.value = true;

      const response = await apiTreatment.reActivateTreatment({
        treatmentId,
        subscriptionItemIdsToRemove: toRemove,
      });

      if (response.statusCode.value !== 200) {
        return false;
      }

      toastStore.addToast({
        type: 'success',
        text: `${t('reActivationRequestSent')} ${t('thisMayTakeUpTo5MinutesPleaseRefreshThePageLater')}`,
      });

      return true;
    } finally {
      reActivateSubscriptionsLoading.value = false;
    }
  };

  const approveMembership = async (treatmentId: number, toRemove?: number[]) => {
    try {
      reActivateSubscriptionsLoading.value = true;

      const response = await apiTreatment.approveMembership({
        treatmentId,
        subscriptionItemIdsToRemove: toRemove,
      });

      if (response.statusCode.value !== 200) {
        return false;
      }

      toastStore.addToast({
        type: 'success',
        text: `${t('reActivationRequestSent')} ${t('thisMayTakeUpTo5MinutesPleaseRefreshThePageLater')}`,
      });

      return true;
    } finally {
      reActivateSubscriptionsLoading.value = false;
    }
  };

  return {
    reActivateSubscriptions,
    reActivateSubscriptionsLoading,
    approveMembership,
  };
};
