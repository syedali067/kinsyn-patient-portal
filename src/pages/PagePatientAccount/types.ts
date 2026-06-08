export interface CropImage {
  src: string;
  width: number;
  height: number;
  transposition?: number;
  orientation?: number;
}

export interface CropTransitions {
  enabled: boolean;
  time: number;
  timingFunction: string;
}

export type PaymentOption = 'apple-pay' | 'google-pay' | 'paypal' | 'credit-card' | 'venmo';

export type ChargebeeFieldType = 'number' | 'expiry' | 'cvv';

export interface ChargebeeFieldError {
  errorCode: string;
  message: string;
}

export interface ChargebeeChangeEvent {
  field: ChargebeeFieldType;
  error: ChargebeeFieldError;
}
