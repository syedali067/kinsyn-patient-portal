import { useStaticData } from './useStaticData';
import { apiTreatment } from '@/api/treatment';
import { SubscriptionStatus } from '@/enums/subscription';
import { useUserStore } from '@/stores/user';
import type { ModifiedSubscriptionItem } from '@/types/subscription';
import type { CategorySlug } from '@/types/treatment';
import { getPlanStatus } from '@/utils/planStatus';
import { computedAsync } from '@vueuse/core';
import { computed, ref } from 'vue';

export const useTreatments = () => {
  const userStore = useUserStore();
  const { categories } = useStaticData();

  const statusOrder = ['approved', 'paymentFailed', 'pending', 'cancelled', 'declined'];

  const categoryOrder = categories.value.map((item) => item.id);

  const isTreatmentsLoading = ref(false);
  const getTreatmentsResponse = computedAsync(
    () => apiTreatment.getTreatments({ patientId: userStore.userId as number }),
    null,
    isTreatmentsLoading,
  );

  const refreshTreatments = async () => {
    await apiTreatment.getTreatments.load({ patientId: userStore.userId as number });
  };

  const treatments = computed(() => {
    return getTreatmentsResponse.value?.data.value?.data;
  });

  const treatmentCounter = computed<Record<CategorySlug, number> | undefined>(() => {
    return treatments.value?.reduce(
      (acc, treatment) => {
        if (!treatment.categorySlug) return acc;
        acc[treatment.categorySlug] = (acc[treatment.categorySlug] || 0) + 1;
        return acc;
      },
      {} as Record<CategorySlug, number>,
    );
  });

  /*
    TODO: perhaps in the future refactoring will be required
    I would like to separate subscriptions and prescriptions separately into the back
  */
  const subscriptionItemsNotFiltered = computed(() => {
    const itemsSubscription =
      treatments.value?.flatMap((treatment): ModifiedSubscriptionItem[] => {
        // Handle treatments with subscriptions
        if (treatment.subscription?.items) {
          return treatment.subscription.items.map((item) => {
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
              treatment,
              dosagePrescription: mainPrescription?.dosage ?? null,
              dosageUnitPrescription: mainPrescription?.dosageUnit ?? null,
              productPrescription: mainPrescription ?? null,
              isPrescription:
                item.product?.productType?.some((type) => type === 'digital') ?? false,
              isMainProduct:
                item.productId === mainPrescription?.productId ||
                item.variant?.variantType === 'subscription',
              meta: treatment.subscription?.meta ?? null,
            } as ModifiedSubscriptionItem;
          });
        }

        // Handle treatments without subscriptions (e.g., biomarkers)
        if (!treatment.subscription && treatment.categorySlug === 'labs') {
          const mainPrescription = treatment.prescriptions.find(
            (prescription) => prescription.product?.isMain,
          );

          if (!mainPrescription?.product) {
            return [];
          }

          return [
            {
              id: treatment.id,
              dateCreated: treatment.dateCreated,
              dateUpdated: treatment.dateUpdated ?? '',
              dateDeclined: treatment.dateDeclined,
              dateApproved: treatment.dateApproved,
              treatmentId: treatment.id,
              itemId: treatment.id,
              treatment,
              dosagePrescription: mainPrescription.dosage ?? null,
              dosageUnitPrescription: mainPrescription.dosageUnit ?? null,
              productPrescription: mainPrescription,
              productId: mainPrescription.productId ?? null,
              refExternal: '',
              variantId: 0,
              quantity: 1,
              amount: 0,
              total: 0,
            } as ModifiedSubscriptionItem,
          ];
        }

        return [];
      }) ?? [];

    const sortedSubscriptions = itemsSubscription?.sort((a, b) => {
      if (a?.isMainProduct && !b?.isMainProduct) {
        return -1;
      }
      if (!a?.isMainProduct && b?.isMainProduct) {
        return 1;
      }

      const aStatus = getPlanStatus(a?.treatment);
      const bStatus = getPlanStatus(b?.treatment);

      if (aStatus === null || bStatus === null) {
        return 0;
      }

      const aStatusIndex = statusOrder.indexOf(aStatus);
      const bStatusIndex = statusOrder.indexOf(bStatus);

      if (aStatusIndex !== bStatusIndex) {
        return aStatusIndex - bStatusIndex;
      }

      if (a?.isPaymentFailed && !b?.isPaymentFailed) {
        return 1;
      }
      if (!a?.isPaymentFailed && b?.isPaymentFailed) {
        return -1;
      }

      const aCategorySlug = a?.treatment.categorySlug;
      const bCategorySlug = b?.treatment.categorySlug;

      if (aCategorySlug === null || bCategorySlug === null) {
        return 0;
      }

      const aIndex = aCategorySlug ? categoryOrder.indexOf(aCategorySlug) : -1;
      const bIndex = bCategorySlug ? categoryOrder.indexOf(bCategorySlug) : -1;

      if (aIndex === -1 && bIndex === -1) {
        return 0;
      }
      if (aIndex === -1) {
        return 1;
      }
      if (bIndex === -1) {
        return -1;
      }

      return aIndex - bIndex;
    });

    return sortedSubscriptions;
  });

  const subscriptionItems = computed(() => {
    return subscriptionItemsNotFiltered.value.filter((item) => {
      if (item.variant?.variantType === 'single') return false;

      if (!item?.isPrescription) {
        const excludedRefs = ['shipping', 'tier', 'basic'];
        return !excludedRefs.some((ref) => item?.refExternal.includes(ref));
      }

      return true;
    });
  });

  const hasActiveMembership = computed(() => {
    return treatments.value?.some(
      (treatment) => treatment.subscription?.status === SubscriptionStatus.Active,
    );
  });

  const hasDeactivatedMembership = computed(() => {
    if (!treatments.value?.length) return false;

    const hasActiveSubscription = treatments.value?.some(
      (treatment) => treatment.subscription?.status === SubscriptionStatus.Active,
    );
    if (hasActiveSubscription) return false;

    const hasAnySubscription = treatments.value.some((t) => t.subscription);
    if (!hasAnySubscription) return false;

    const hasFutureSubscription = treatments.value.some(
      (t) => t.subscription?.status === SubscriptionStatus.Future,
    );
    return !hasFutureSubscription;
  });

  return {
    treatments,
    refreshTreatments,
    subscriptionItemsNotFiltered,
    subscriptionItems,
    isTreatmentsLoading,
    treatmentCounter,
    hasActiveMembership,
    hasDeactivatedMembership,
  };
};
