import type { PaymentIntentStatus } from './payment';
import type { Prescription } from './prescription';
import type { ProductType } from './product';
import type { QuizCategory } from './quiz';
import type { Treatment } from './treatment';
import type { Gender } from './user';
import type { Variant } from './variant';
import { SubscriptionStatus } from '@/enums/subscription';

export type ModifiedSubscriptionItemType = 'addon' | 'treatment';

export interface SubscriptionItemProduct {
  id: number;
  type: string | null;
  productType?: ProductType[];
  heading: string | null;
  clarification: string | null;
  title: string;
  display: boolean;
  fullfillmentType: string | null;
  shippingAmount: number;
  url: string;
  rxOnly: boolean;
  quizCategory: QuizCategory;
  onlyForPrescribedPatients: boolean;
  image: {
    id: number;
    url: string;
  } | null;
  isMain: boolean | null;
  variants: Variant[];
  dosages: number[];
  dosageUnit: string | null;
  quantityList?: number[];
  injectionAck: boolean;
  gender: Gender[];
  shippable: boolean;
  status: string;
  isDisplayedFromPrescription: boolean;
}

export interface SubscriptionItem {
  amount: number;
  dateCreated: string;
  dateUpdated: string;
  id: number;
  product: SubscriptionItemProduct | null;
  productId: number | null;
  quantity: number;
  refExternal: string;
  total: number;
  subtotal: number;
  discount: number | null;
  variant: Variant | null;
  variantId: number;
}

export interface SubscriptionMeta {
  prescriptionUpdateComment: string | null;
  [key: string]: unknown;
}

export interface Subscription {
  currency: string;
  dateSubscription: string;
  paymentIntentStatus: PaymentIntentStatus | null;
  items: SubscriptionItem[];
  itemsChanges: SubscriptionItem[];
  dateCancelled: string | null;
  dateCreated: string;
  dateNext: string | null;
  dateStarted?: string;
  dateUpdated?: string;
  id: number;
  refExternal?: string;
  status: SubscriptionStatus;
  userId: number;
  isPaymentFailed: boolean;
  cycle: number | null;
  statusComment: string | null;
  meta: SubscriptionMeta | null;
}

export interface ModifiedSubscriptionItem extends SubscriptionItem {
  dateDeclined: string | null;
  dateApproved: string | null;
  dateCancelled: string | null;
  dateNext: string | null;
  isPaymentFailed: boolean;
  treatmentId: number;
  subscriptionId: number | null;
  status: SubscriptionStatus | null;
  cycle: number | null;
  itemId: number;
  treatment: Treatment;
  items: SubscriptionItem[] | null;
  itemsChanges: SubscriptionItem[] | null;
  dosagePrescription: number | null;
  dosageUnitPrescription: string | null;
  productPrescription: null | Prescription;
  isPrescription: boolean;
  isMainProduct: boolean;
  meta: SubscriptionMeta | null;
}
