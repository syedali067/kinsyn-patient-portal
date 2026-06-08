import { apiCart } from '@/api/cart';
import { useChargebee } from '@/composables/useChargebee';
import type { CartSource } from '@/types/cart';
import type { PaymentHandlerOptions } from '@/types/chargebee';
import type { ChargebeeIntegrationType } from '@/types/chargebee';
import type { WalletPaymentMethodType } from '@/types/payment';
import { ref } from 'vue';

const paymentMethodMap: Record<WalletPaymentMethodType, ChargebeeIntegrationType> = {
  APPLE_PAY: 'apple-pay',
  GOOGLE_PAY: 'google-pay',
  PAYPAL_EXPRESS_CHECKOUT: 'paypal',
  VENMO: 'venmo',
};

export const useWalletPayment = (buttonSelector: string, source: CartSource = 'pharmacy') => {
  const { chargebeeInstance } = useChargebee();
  const initWalletLoading = ref(false);
  const isApplePayCompatible = ref(true);
  const walletErrorMessage = ref('');

  const initWallet = async (
    paymentMethodType: WalletPaymentMethodType,
    amount: number,
    options: PaymentHandlerOptions,
  ) => {
    try {
      initWalletLoading.value = true;

      const walletHandler = await chargebeeInstance.value?.load(
        paymentMethodMap[paymentMethodType],
      );

      if (paymentMethodType === 'APPLE_PAY') {
        isApplePayCompatible.value = walletHandler?.canMakePayments() ?? false;
      }

      const paymentIntent = await apiCart.createPaymentIntent({
        paymentMethodType,
        amount,
        source,
      });

      if (paymentIntent.error.value) {
        walletErrorMessage.value = paymentIntent.error.value.message;
        return;
      }

      // Venmo uses selector without '#'
      const universalSelector =
        paymentMethodType === 'VENMO' ? buttonSelector.slice(1) : buttonSelector;

      walletHandler?.setPaymentIntent(paymentIntent.data.value!.data);
      await walletHandler?.mountPaymentButton(universalSelector);
      initWalletLoading.value = false;
      await walletHandler?.handlePayment(options);
    } catch (error) {
      walletErrorMessage.value = (error as { message: string }).message;
    } finally {
      initWalletLoading.value = false;
    }
  };

  return {
    initWallet,
    initWalletLoading,
    isApplePayCompatible,
    walletErrorMessage,
  };
};
