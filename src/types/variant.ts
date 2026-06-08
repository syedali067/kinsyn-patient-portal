export type VariantType = 'subscription' | 'subscriptionAddon' | 'single';

export type VariantStatus = 'live' | 'disabled';

export type VariantPeriodUnit = 'day' | 'week' | 'month' | 'year';

export type VariantPriceModel = 'perUnit' | 'fixed';

export interface PharmacyProduct {
  productId: string;
  unitsDose: string;
  directions: string;
  doseFrequency: string;
}
export interface VariantDosageCycle {
  title: string;
  cycleNumber: number;
  pharmacyProducts: PharmacyProduct[];
}

export interface Variant {
  id: number;
  title: string;
  status: VariantStatus;
  variantType: VariantType;
  enabled: boolean;
  shippable: boolean;
  externalRefPrice: string;
  variantCustomTitle: string;
  variantAmount: number;
  variantMaxPurchaseQuantity: number | null;
  variantPeriod: number;
  variantShippingPeriod: number;
  variantPeriodUnit: VariantPeriodUnit;
  variantShippingPeriodUnit: VariantPeriodUnit;
  variantRefGroup: string;
  variantPriceModel: VariantPriceModel;
  variantShipping: boolean;
  variantSku: string | null;
  dateCreated: string;
  dateUpdated: string;
  dosageCycleEnabled: boolean;
  dosageCycle: VariantDosageCycle[];
  variantRecommended: boolean;
  fullPrice: number | null;
}
