// Status based on treatment and subscription status.
import { SubscriptionStatus } from '@/enums/subscription';
import { TreatmentReviewStatus } from '@/enums/treatment';
import type { Treatment, TreatmentPlanStatus } from '@/types/treatment';

// to properly sort subscriptions statuses we need to take
// into account the review status of the treatment
export const getPlanStatus = (treatment?: Treatment): TreatmentPlanStatus | null => {
  if (!treatment) {
    return null;
  }

  if (
    (treatment.reviewStatus === TreatmentReviewStatus.Pending ||
      treatment.reviewStatus === TreatmentReviewStatus.Approved ||
      treatment.reviewStatus === TreatmentReviewStatus.Cancelled) &&
    (treatment.subscription?.status === SubscriptionStatus.Cancelled ||
      treatment.subscription?.status === SubscriptionStatus.NotRenewed)
  ) {
    return 'cancelled';
  }

  if (treatment.reviewStatus === TreatmentReviewStatus.Declined) {
    return 'declined';
  }

  if (treatment.reviewStatus === TreatmentReviewStatus.Pending) {
    return 'pending';
  }

  return 'approved';
};
