import { apiTreatment } from '@/api/treatment';
import type { ModifiedSubscriptionItem } from '@/types/subscription.ts';
import { getPlanStatus } from '@/utils/planStatus';
import { computedAsync } from '@vueuse/core';
import { computed, ref } from 'vue';

export const useSubscriptions = (patientId: number | null = null) => {
  const loadingTreatments = ref(false);

  const getPatientTreatments = computedAsync(
    () => {
      if (!patientId) return;
      return apiTreatment.getTreatments({ patientId });
    },
    null,
    loadingTreatments,
  );

  const providerOrderStatus = {
    pending: 1,
    approved: 2,
    cancelled: 3,
    declined: 4,
  };

  const treatments = computed(() => {
    return getPatientTreatments.value?.data.value?.data || [];
  });

  const subscriptionItems = computed(() => {
    const itemsSubscription =
      treatments.value?.flatMap((treatment) => {
        return treatment.subscription?.items
          ?.filter((item) => {
            return item.variant?.variantType !== 'single';
          })
          .map((item) => {
            const mainPrescription = treatment.prescriptions.find(
              (prescription) => prescription.product?.isMain,
            );

            return {
              ...item,
              dateDeclined: treatment.dateDeclined,
              dateApproved: treatment.dateApproved,
              dateCancelled: treatment.subscription?.dateCancelled,
              dateNext: treatment.subscription?.dateNext,
              isPaymentFailed: treatment.subscription?.isPaymentFailed,
              treatmentId: treatment.id,
              subscriptionId: treatment.subscription?.id,
              status: treatment.subscription?.status,
              cycle: treatment.subscription?.cycle,
              itemId: item.id,
              items: treatment.subscription?.items,
              itemsChanges: treatment.subscription?.itemsChanges,
              meta: treatment.subscription?.meta,
              treatment,
              dosagePrescription: mainPrescription?.dosage,
              dosageUnitPrescription: mainPrescription?.dosageUnit,
              productPrescription: mainPrescription,
              isPrescription: item.product?.productType?.some((type) => type === 'digital'),
            } as ModifiedSubscriptionItem;
          });
      }) || [];

    const sortedSubscriptions = [...itemsSubscription]?.sort((a, b) => {
      const aStatus = getPlanStatus(a?.treatment);
      const bStatus = getPlanStatus(b?.treatment);

      if (aStatus === null || bStatus === null) {
        return 0;
      }

      if (providerOrderStatus[aStatus] !== providerOrderStatus[bStatus]) {
        return providerOrderStatus[aStatus] - providerOrderStatus[bStatus];
      }

      if (a?.isPaymentFailed && !b?.isPaymentFailed) {
        return 1;
      }

      if (!a?.isPaymentFailed && b?.isPaymentFailed) {
        return -1;
      }

      return 0;
    });

    return sortedSubscriptions.filter((item) =>
      !item?.isPrescription
        ? !item?.refExternal.includes('shipping') &&
          !item?.refExternal.includes('tier') &&
          !item?.refExternal.includes('basic')
        : item,
    );
  });

  const supplements = computed(() => {
    return (
      subscriptionItems.value.filter((item): item is ModifiedSubscriptionItem => {
        const productType = item?.product?.productType;
        return (
          Array.isArray(productType) &&
          productType.includes('addOn') &&
          item?.treatment.status !== 'canceled' &&
          item?.treatment.status !== 'declined'
        );
      }) || []
    );
  });

  const medications = computed(() => {
    return (
      subscriptionItems.value.filter((item): item is ModifiedSubscriptionItem => {
        const productType = item?.product?.productType;
        return (
          Array.isArray(productType) &&
          !productType.includes('addOn') &&
          item?.treatment.status !== 'canceled' &&
          item?.treatment.status !== 'declined'
        );
      }) || []
    );
  });

  return {
    loadingTreatments,
    supplements,
    medications,
  };
};
