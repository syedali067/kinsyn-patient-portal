import { apiCart } from '@/api/cart';
import type { BuyNowPayload, UpdateItemPayload } from '@/api/cart/types';
import type { Cart, CartItem } from '@/types/cart';
import type { Product } from '@/types/product';
import type { Variant } from '@/types/variant';
import { formatPrice } from '@/utils/formatters';
import { defineStore } from 'pinia';
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useCartStore = defineStore('cart', () => {
  const { t } = useI18n();

  const getCartLoading = ref(false);
  const updateCartLoading = ref(false);
  const addItemLoading = ref(false);

  const cart = ref<Cart>();

  const getCart = async (cache = true) => {
    try {
      getCartLoading.value = true;
      const response = cache ? await apiCart.getCart() : await apiCart.getCart.load();
      cart.value = response.data.value?.data;
    } finally {
      getCartLoading.value = false;
    }
  };

  const items = computed(() => cart.value?.items ?? []);
  const itemsCount = computed(() => items.value.length);

  const hasRxProduct = computed(() => items.value.some((item) => !!item.product?.rxOnly));

  const subtotal = computed(() => cart.value?.subtotal ?? 0);
  const formattedSubtotal = computed(() => formatPrice(subtotal.value, cart.value?.currency));

  const membership = computed(() => cart.value?.discounts.find((d) => d.type === 'membership'));
  const membershipAmount = computed(() => membership.value?.amount ?? 0);
  const formattedMembershipAmount = computed(
    () => `-${formatPrice(membershipAmount.value, cart.value?.currency)}`,
  );

  const coupon = computed(() => cart.value?.discounts.find((d) => d.type === 'coupon'));
  const couponAmount = computed(() => coupon.value?.amount ?? 0);
  const formattedCouponAmount = computed(
    () => `-${formatPrice(couponAmount.value, cart.value?.currency)}`,
  );
  const couponCode = computed(() => coupon.value?.coupon ?? '');

  const shipping = computed(() => cart.value?.shipping ?? 0);
  const formattedShipping = computed(() =>
    shipping.value > 0 ? formatPrice(shipping.value, cart.value?.currency) : t('free'),
  );

  const shippingSubtotal = computed(() => cart.value?.shippingSubtotal ?? 0);
  const formattedShippingSubtotal = computed(() =>
    shippingSubtotal.value > 0
      ? formatPrice(cart.value?.shippingSubtotal, cart.value?.currency)
      : t('free'),
  );

  const shippingDiscount = computed(() => cart.value?.shippingDiscount ?? 0);

  const total = computed(() => cart.value?.total ?? 0);
  const formattedTotal = computed(() => formatPrice(total.value, cart.value?.currency));

  const addItem = async (
    productId: Product['id'],
    quantity: UpdateItemPayload['quantity'],
    variantId: Variant['id'],
  ) => {
    try {
      updateCartLoading.value = true;
      addItemLoading.value = true;

      const { data } = await apiCart.updateItem({ productId, quantity, variantId });

      cart.value = data.value?.data;

      if (data.value?.data) {
        apiCart.getCart.updateCache(data.value.data);
      }
    } finally {
      updateCartLoading.value = false;
      addItemLoading.value = false;
    }
  };

  const updateItem = async (
    cartItemId: CartItem['id'],
    productId: Product['id'],
    quantity: UpdateItemPayload['quantity'],
    variantId: Variant['id'],
  ) => {
    if (quantity === 0) {
      await deleteItem(cartItemId);
    } else {
      try {
        updateCartLoading.value = true;

        const { data } = await apiCart.updateItem({
          id: cartItemId,
          productId,
          quantity,
          variantId,
          appendQuantity: false,
        });

        cart.value = data.value?.data;

        if (data.value?.data) {
          apiCart.getCart.updateCache(data.value.data);
        }
      } finally {
        updateCartLoading.value = false;
      }
    }
  };

  const deleteItem = async (cartItemId: CartItem['id']) => {
    cart.value?.items.splice(
      cart.value.items.findIndex((item) => item.id === cartItemId),
      1,
    );

    try {
      updateCartLoading.value = true;

      const { data } = await apiCart.removeItem({
        id: cartItemId,
      });

      cart.value = data.value?.data;

      if (data.value?.data) {
        apiCart.getCart.updateCache(data.value.data);
      }
    } finally {
      updateCartLoading.value = false;
    }
  };

  const buy = async (checkoutPayload: Omit<BuyNowPayload, 'cartId' | 'items'>) => {
    return apiCart.buyNow({
      ...checkoutPayload,
      cartId: cart.value?.id as number,
      items: [],
    });
  };

  const addCouponLoading = ref(false);
  const addCouponError = ref<string | null>(null);

  const addCoupon = async (value: string) => {
    try {
      addCouponLoading.value = true;
      const response = await apiCart.addCoupon({ coupon: value });

      if (response.error.value) {
        addCouponError.value = response.data.value?.message ?? null;
        return;
      }

      const data = response.data.value?.data;
      cart.value = data;

      if (data) {
        apiCart.getCart.updateCache(data);
      }
    } finally {
      addCouponLoading.value = false;
    }
  };

  const removeCouponLoading = ref(false);

  const removeCoupon = async () => {
    try {
      removeCouponLoading.value = true;
      const response = await apiCart.removeCoupon({ coupon: couponCode.value });

      if (response.error.value) return;

      const data = response.data.value?.data;
      cart.value = data;

      if (data) {
        apiCart.getCart.updateCache(data);
      }
    } finally {
      removeCouponLoading.value = false;
    }
  };

  onBeforeMount(() => {
    getCart();
  });

  return {
    cart,
    getCart,
    items,
    itemsCount,
    hasRxProduct,

    subtotal,
    formattedSubtotal,
    membershipAmount,
    formattedMembershipAmount,
    couponAmount,
    formattedCouponAmount,
    couponCode,
    shipping,
    formattedShipping,
    shippingSubtotal,
    formattedShippingSubtotal,
    shippingDiscount,
    total,
    formattedTotal,

    getCartLoading,
    updateCartLoading,
    addItemLoading,

    buy,
    addItem,
    updateItem,
    deleteItem,

    addCoupon,
    addCouponLoading,
    addCouponError,
    removeCoupon,
    removeCouponLoading,
  };
});
