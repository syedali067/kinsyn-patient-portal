export type ChargebeeFieldType = 'number' | 'expiry' | 'cvv';

export interface ChargebeeFieldError {
  errorCode: string;
  message: string;
}

export interface ChargebeeChangeEvent {
  field: ChargebeeFieldType;
  error: ChargebeeFieldError;
}

export interface Chargebee {
  init: (options: { site: string; domain?: string; publishableKey?: string }) => ChargebeeInstance;
}

export interface ChargebeeInstance {
  load: (name: ChargebeeIntegrationType) => Promise<ChargebeePaymentHandler>;
}

export type ChargebeeIntegrationType = 'apple-pay' | 'google-pay' | 'paypal' | 'venmo';

export interface ChargebeePaymentHandler {
  setPaymentIntent: (intent: ChargebeePaymentIntent) => void;
  mountPaymentButton: (selector: string) => Promise<void>;
  handlePayment: (options: PaymentHandlerOptions) => Promise<void>;
  canMakePayments: () => boolean;
}

export interface ChargebeePaymentIntent {
  id: string;
  object: string;
}

// I think this one object is returned by Chargebee
// only if we use a default Chargebee testing gateway, but I'm not 100% sure
export interface ChargebeePaymentIntentWrapped {
  paymentIntent: ChargebeePaymentIntent;
}

export interface PaymentHandlerOptions {
  success: (data: ChargebeePaymentIntent | ChargebeePaymentIntentWrapped) => void;
  error: (error: unknown) => void;
}
