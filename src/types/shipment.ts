import type { Subscription } from './subscription';
import type { ShipmentStatus } from '@/enums/shipment';
import type { CartDiscount } from '@/types/cart.ts';
import type { CategorySlug } from '@/types/treatment';
import type { Variant } from '@/types/variant';

export type SortValuesShipmentsFilters =
  | 'id_asc'
  | 'id_desc'
  | 'dateCreated_asc'
  | 'dateCreated_desc'
  | 'dateShipped_asc'
  | 'dateShipped_desc'
  | 'refExternal_asc'
  | 'refExternal_desc'
  | 'status_asc'
  | 'status_desc'
  | 'productName_asc'
  | 'productName_desc';

export interface ShipmentGroups {
  orders: Shipment[];
  years: number[];
}

export interface Shipment {
  id: number;
  refExternal: string;
  total: number;
  discountTotal: number;
  subtotal: number;
  discountSubTotal: number;
  orderItems: OrderItem[];
  shipping?: number;
  shippingAddress: ShipmentDetailsAddress;
  discount: number;
  dateCreated: string;
  dateShipped: string;
  billingAddress: ShipmentDetailsAddress;
  invoiceId: number;
  patient: {
    id: number;
    fullName: string;
  } | null;
  status: ShipmentStatus;
  trackingNumber: string;
  trackingUrl: string;
  currency: string;
  invoice: {
    id: number;
    refExternal: string;
    dateCreated: string;
    subscription: Subscription | null;
  };
}

export interface ShipmentDetails {
  id: number;
  invoice: {
    id: number;
    refExternal: string;
    dateCreated: string;
    paymentDetails: InvoicePaymentDetails | null;
    coupons: string | null;
    invoiceItems: InvoiceItem[];
    discounts: CartDiscount[];
  };
  refExternal: string;
  orderItems: OrderItem[];
  billingAddress: ShipmentDetailsAddress;
  shippingAddress: ShipmentDetailsAddress;
  subtotal: number;
  discountSubTotal: number;
  shipping: number;
  total: number;
  discountTotal: number;
  discount: number;
}

export type OrderItemProductType = 'Add-on' | 'Digital' | 'Injection' | 'Pill' | 'Tube' | 'Troche';

export interface OrderItem {
  id: number;
  productType: OrderItemProductType;
  status: ShipmentStatus;
  productImage: string | null;
  description: string;
  trackingUrl: string;
  amount: number;
  amountPaid: number;
  discountAmount: number | null;
  quantity: number;
  productClarification: string;
  image: string | null;
  productId: number;
  refExternal: string;
  dateCompleted: string;
  dateShipped: string;
  url: string;
  productVariant: Variant | null;
  product: OrderProduct | null;
  productCategorySlug: CategorySlug;
}

export interface OrderProduct {
  quizCategories: CategorySlug[];
}

export interface OrderItemWithSubscription extends OrderItem {
  subscription: Subscription | null;
}

export type ShipmentAddressObjectType = 'billing_address' | 'shipping_address';
export type ShipmentAddressValidationStatus = 'validated' | 'not_validated';

export interface ShipmentDetailsAddress {
  zip: string;
  city: string;
  email: string;
  line1: string;
  line2: string;
  phone: string;
  state: string;
  object: ShipmentAddressObjectType;
  country: string;
  validation_status: ShipmentAddressValidationStatus;
  state_code: string;
  first_name?: string;
  last_name?: string;
}

export type InvoicePaymentFundingType = 'credit' | 'not_applicable';
export type InvoicePaymentBrand = 'visa' | 'mastercard';

export interface InvoicePaymentDetails {
  iin: string;
  brand: InvoicePaymentBrand;
  last4: string;
  object: string;
  expiry_year: number;
  expiry_month: number;
  funding_type: InvoicePaymentFundingType;
  masked_number: string;
}

export interface InvoiceItem {
  id: number;
  amount: number;
  quantity: number;
  total: number;
  variantId: Variant['id'];
  discountAmount: number | null;
}
