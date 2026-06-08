import { SubscriptionStatus } from '@/enums/subscription.ts';
import type { ModifiedSubscriptionItemType } from '@/types/subscription';
import type { TreatmentPlanStatus } from '@/types/treatment';

export interface DrawerModifyTreatmentSubscription {
  treatmentId?: number;
  productId?: number;
  itemType?: ModifiedSubscriptionItemType;
  planStatus?: TreatmentPlanStatus | null;
  refExternal?: string;
  subscriptionStatus?: SubscriptionStatus | null;
}
