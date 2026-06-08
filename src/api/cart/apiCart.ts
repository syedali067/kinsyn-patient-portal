import type {
  BuyNowPayload,
  CreatePaymentIntentPayload,
  RemoveItemPayload,
  UpdateCartPayload,
  UpdateItemPayload,
} from '@/api/cart/types';
import { useApi } from '@/composables/useApi';
import { useApiMemo } from '@/composables/useApiMemo';
import type { Cart } from '@/types/cart';
import type { ChargebeePaymentIntent } from '@/types/chargebee';
import type { Response } from '@/types/response';
import type { BeforeFetchContext } from '@vueuse/core';

const pharmacyOptions = {
  beforeFetch({ options }: BeforeFetchContext) {
    options.headers = {
      ...options.headers,
      'X-CART-SOURCE': 'pharmacy',
    };
  },
};

const getCart = useApiMemo(() => {
  return useApi<Response<Cart>>('/api/v1/cart', pharmacyOptions).get();
});

const updateCart = (payload: UpdateCartPayload) => {
  return useApi<Response<Cart>>('/api/v1/cart', pharmacyOptions).put(payload);
};

const updateItem = (payload: UpdateItemPayload) => {
  return useApi<Response<Cart>>('/api/v1/cart/update-item', pharmacyOptions).put(payload);
};

const removeItem = (payload: RemoveItemPayload) => {
  return useApi<Response<Cart>>('/api/v1/cart/remove-item', pharmacyOptions).put(payload);
};

const removeAll = () => {
  return useApi<Response<Cart>>('/api/v1/cart/remove-all', pharmacyOptions).put();
};

const createPayment = () => {
  return useApi<Response<{ url: string }>>('/api/v1/cart/payment', pharmacyOptions).post();
};

const buyNow = (payload: BuyNowPayload) => {
  return useApi<Response<{ url: string }>>('/api/v1/cart/buy-now', pharmacyOptions).post(payload);
};

const createPaymentIntent = (payload: CreatePaymentIntentPayload) => {
  return useApi<Response<ChargebeePaymentIntent>>(
    '/api/v1/cart/create-payment-intent',
    pharmacyOptions,
  ).post(payload);
};

const addCoupon = (payload: { coupon: string }) => {
  return useApi<Response<Cart>>('/api/v1/cart/add-coupon', {
    beforeFetch({ options }: BeforeFetchContext) {
      options.headers = {
        ...options.headers,
        'X-CART-SOURCE': 'pharmacy',
      };
      Object.assign(options, { toastOptions: { displayError: false } });
    },
    updateDataOnError: true,
  }).put(payload);
};

const removeCoupon = (payload: { coupon: string }) => {
  return useApi<Response<Cart>>('/api/v1/cart/remove-coupon', pharmacyOptions).put(payload);
};

export const apiCart = {
  getCart,
  updateCart,
  updateItem,
  removeItem,
  removeAll,
  createPayment,
  createPaymentIntent,
  buyNow,
  addCoupon,
  removeCoupon,
};
