import { useScrollToError } from '../composables/useScrollToError';
import { useAddressForm } from './useAddressForm';
import { useConsentForm } from './useConsentForm';
import { usePaymentForm } from './usePaymentForm';
import { usePhoneForm } from './usePhoneForm';
import { useWalletPayment } from './useWalletPayment';
import type { BuyNowPayload } from '@/api/cart/types';
import { useCartStore } from '@/stores/cart';
import type { CartSource } from '@/types/cart';
import type { ChargebeePaymentIntent, ChargebeePaymentIntentWrapped } from '@/types/chargebee';
import type { WalletPaymentMethodType } from '@/types/payment';
import { computed, watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

export const useCheckout = (source: CartSource = 'pharmacy') => {
  const router = useRouter();
  const { t } = useI18n();
  const cartStore = useCartStore();
  const { scrollToError } = useScrollToError('.validation-error');
  const enabledWalletPaymentMethods: WalletPaymentMethodType[] = [];

  const {
    shippingAddressValidation,
    billingAddressValidation,
    shippingAddressForm,
    billingAddressForm,
    isBillingAddressSame,
  } = useAddressForm();

  const { agreeToAuthorizeForm, marketingForm } = useConsentForm();
  const { phoneValidation, consentForm } = usePhoneForm();
  const { paymentForm, isNewCard, paymentValidation, validateNewCard } = usePaymentForm();

  const { initWallet, initWalletLoading, isApplePayCompatible, walletErrorMessage } =
    useWalletPayment('#wallet-button', source);

  const payload = computed(() => {
    const payload: Omit<BuyNowPayload, 'cartId' | 'items'> = {
      tokenId: null,
      paymentSourceId: null,
      paymentIntentId: null,
      paymentMethodType: paymentForm.value.paymentMethodType,
      shippingAddress: shippingAddressForm.value,
      billingAddress: !isBillingAddressSame.value ? billingAddressForm.value : null,
      source: source,
      consent: {
        consentEmailPersonalizedHealth: agreeToAuthorizeForm.value.agreeToAuthorize,
        consentSmsTransactional: consentForm.value.consentSmsTransactional,
        consentEmailGeneralMarketing: marketingForm.value.consentEmailGeneralMarketing,
        consentSmsMarketing: marketingForm.value.consentSmsMarketing,
      },
    };

    if (paymentForm.value.paymentMethodType === 'CARD' && isNewCard.value) {
      payload.tokenId = paymentForm.value.tokenId;
    }

    if (paymentForm.value.paymentMethodType === 'CARD' && !isNewCard.value) {
      payload.paymentSourceId = paymentForm.value.paymentSourceId;
    }

    if (paymentForm.value.paymentMethodType && paymentForm.value.paymentMethodType !== 'CARD') {
      payload.paymentIntentId = paymentForm.value.paymentIntentId;
    }

    return payload;
  });

  const buyLoading = ref(false);

  const buy = async () => {
    try {
      buyLoading.value = true;

      const validators = [
        shippingAddressValidation.value.$validate,
        phoneValidation.value.$validate,
        validateNewCard,
        paymentValidation.value.$validate,
        billingAddressValidation.value.$validate,
      ];

      const validationResults = [];

      for (const validate of validators) {
        const result = await validate();
        validationResults.push(result);
      }

      if (validationResults.includes(false)) {
        scrollToError();
        return;
      }

      const response = await cartStore.buy(payload.value);

      if (response.error.value) {
        return;
      }

      const cid = cartStore.cart?.id;
      await cartStore.getCart(false);
      await router.push({ name: 'ThankYou', query: cid ? { cid } : undefined });
    } finally {
      buyLoading.value = false;
    }
  };

  watch(
    () => paymentForm.value.paymentMethodType,
    async (paymentMethodType) => {
      walletErrorMessage.value = '';

      if (!paymentMethodType || paymentMethodType === 'CARD') {
        return;
      }

      await initWallet(paymentMethodType, cartStore.total, {
        success(data) {
          const paymentIntent = normalizeChargebeePaymentIntent(data);
          paymentForm.value.paymentIntentId = paymentIntent.id;
          buy();
        },
        error() {
          walletErrorMessage.value = t('paymentFailed');
        },
      });
    },
  );

  // Normalizer: always return a ChargebeePaymentIntent
  const normalizeChargebeePaymentIntent = (
    data: ChargebeePaymentIntent | ChargebeePaymentIntentWrapped,
  ) => {
    return (data as ChargebeePaymentIntent).object
      ? (data as ChargebeePaymentIntent)
      : (data as ChargebeePaymentIntentWrapped).paymentIntent;
  };

  return {
    buy,
    buyLoading,
    payload,
    initWalletLoading,
    isApplePayCompatible,
    walletErrorMessage,
    enabledWalletPaymentMethods,
  };
};
