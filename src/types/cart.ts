import { type CartStatus } from '@/enums/cart';
import type { Product } from '@/types/product';
import type { User } from '@/types/user';
import type { Variant } from '@/types/variant';

export interface Cart {
  id: number;
  status: CartStatus;
  source: CartSource;
  subtotal: number;
  shipping: number;
  shippingDiscount: number;
  shippingSubtotal: number;
  discount: number;
  total: number;
  submissionId: number | null;
  userId: number;
  currency: string;
  dateCompleted: string | null;
  dateUpdated: string | null;
  dateCreated: string | null;
  user: Pick<User, 'id' | 'fullName'>;
  items: CartItem[];
  coupons: string[];
  discounts: CartDiscount[];
}

export type CartSource = 'pharmacy' | 'quiz';

export interface CartDiscount {
  amount: number;
  coupon: string;
  type: CartDiscountType;
}

export type CartDiscountType = 'coupon' | 'membership';

export interface CartItem {
  id: number;
  cartId: number;
  quantity: number;
  amount: number;
  subtotal: number;
  total: number;
  shipping: number;
  discount: number;
  dateCreated: string;
  dateUpdated: string;
  variantId: number;
  productId: number;
  variant?: Variant;
  product?: Product;
  dosage?: number;
  dosageUnit?: string;
}

export interface CartAddress {
  addressFirstName: string;
  addressLastName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  zip: string;
  state_code: string;
  email: string;
}
