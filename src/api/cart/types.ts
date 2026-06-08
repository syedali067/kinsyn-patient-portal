import type { CartSource } from '@/types/cart';
import type { CartAddress } from '@/types/cart';
import type { PaymentMethodType } from '@/types/payment';
import type { Variant } from '@/types/variant';

export interface UpdateCartPayload {
  items: UpdateCartItem[];
  usage?: string;
  dosage?: string;
  clear?: boolean;
  submissionId?: number;
  coupon?: string;
}

export interface UpdateCartItem {
  productId: number;
  variantId: number | null;
  quantity: number;
  dosage?: number | null;
  dosageUnit?: string;
  variant?: Variant | null;
}

export interface UpdateItemPayload {
  id?: number;
  productId: number;
  variantId?: number | null;
  quantity: number;
  dosage?: number | string | null;
  dosageUnit?: string | null;
  appendQuantity?: boolean;
}

export interface RemoveItemPayload {
  id: number;
}

export interface BuyNowPayload {
  cartId: number;
  items: UpdateCartItem[];
  source: CartSource;
  shippingAddress: CartAddress;
  billingAddress: CartAddress | null;
  tokenId?: string | null;
  paymentSourceId?: string | null;
  paymentIntentId?: string | null;
  paymentMethodType?: PaymentMethodType;
  coupon?: string;
  eventId?: string;
  consent?: {
    consentEmailGeneralMarketing?: boolean;
    consentSmsMarketing?: boolean;
    consentEmailPersonalizedHealth?: boolean;
    consentSmsTransactional?: boolean;
  };
}

export interface CreatePaymentIntentPayload {
  amount: number;
  paymentMethodType: PaymentMethodType;
  source: CartSource;
}
