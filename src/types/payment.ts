export type PaymentIntentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'requires_capture'
  | 'canceled'
  | 'succeeded';

export type CardType = 'visa' | 'mastercard' | 'american_express' | 'discover' | 'jcb' | 'maestro';

export interface PaymentMethod {
  externalRef: string;
  card: {
    type: CardType;
    ending: string;
    expirationDate: string;
    default: boolean;
  };
}

export type PaymentMethodType =
  | 'CARD'
  | 'APPLE_PAY'
  | 'GOOGLE_PAY'
  | 'PAYPAL_EXPRESS_CHECKOUT'
  | 'VENMO';

export type WalletPaymentMethodType = Exclude<PaymentMethodType, 'CARD'>;
