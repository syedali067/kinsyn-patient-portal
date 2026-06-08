import type { ModifiedSubscriptionItemType } from '@/types/subscription';

export interface DrawerInstructionsForUseSubscription {
  productId: number;
  imageUrl?: string;
  imageAlt?: string;
  isRxOnly?: boolean;
  categoryName?: string;
  itemType?: ModifiedSubscriptionItemType;
  itemTitle?: string;
  formattedPriceWithPeriod?: string;
  formattedDosage: string;
  quantity: number;
}
