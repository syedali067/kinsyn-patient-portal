import type { License } from '@/types/licenses';
import type { PaymentMethod } from '@/types/payment.ts';
import type { ProfileUser, ProviderProfession, TimeZone, User, UserRole } from '@/types/user';

export type AddressType = 'shipping' | 'billing';

export interface SessionInfoResponse {
  csrfTokenName: string;
  csrfTokenValue: string;
  email: string;
  groups: UserRole[];
  id: number;
  isGuest: boolean;
  isPatient: boolean;
  isProvider: boolean;
  isProviderUser: boolean;
  returnUrl: string;
  timeout: number;
  uid: string;
  username: string;
}

export interface LoginPayload {
  loginName: string;
  password: string;
}

export interface LoginResponse {
  csrfTokenValue: string;
  modelName: string;
  returnUrl: string;
  user: User;
}

export interface LoginTOTPResponse {
  authMethod: string;
  otherMethods: string[];
  authForm: string;
  returnUrl: string;
  headHtml: string;
  bodyHtml: string;
}

export interface UserGetTotpSecretResponse {
  secret: string;
  qr: string;
}

export interface UserTOTPVerifyResponse {
  message: string;
  redirect?: string | null;
}

export interface UserTOTPDisableResponse {
  message: string;
  success: boolean;
}

export interface ResetPasswordPayload {
  loginName: string;
}

export interface SetPasswordPayload {
  code: string;
  id: string;
  newPassword: string;
}

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  verificationCode: string;
  source?: string;
  consent?: {
    consentEmailGeneralMarketing?: boolean;
    consentEmailPersonalizedQuiz?: boolean;
  };
}

export interface GetPaymentMethodsResponse {
  paymentMethods: PaymentMethod[];
}

export interface UserUpdatePayload {
  user?: {
    firstName?: string;
    lastName?: string;
    middleName?: string | null;
    displayName?: string;
    phone?: string;
    email?: string;
    isSms?: boolean;
    alternativeEmail?: string;
    useAlternativeEmail?: boolean;
    consentEmailGeneralMarketing?: boolean;
    consentEmailPersonalizedQuiz?: boolean;
    consentEmailPersonalizedHealth?: boolean;
    consentSmsMarketing?: boolean;
    consentSmsTransactional?: boolean;
  };
  shipping?: {
    name?: string;
    phone?: string;
    address?: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string | null;
      postalCode?: string;
      state?: string;
    };
  };
  profession?: {
    value?: string;
    label?: string;
  };
  timeZone?: string;
  bankingDetails?: {
    accountHolder?: string;
    bankName?: string;
    bankAddress?: string;
    accountNumber?: string;
    routingNumber?: string;
  };
  paymentSettings?: {
    syncVisit?: string | number;
    aSyncVisit?: string | number;
    refillVisit?: string | number;
    payoutPeriod?: string;
  };
  signatureFile?: string;
  avatarFile?: string;
  role?: string;
}

export interface UserResponse {
  id: number;
  user: ProfileUser;
  avatar: string | null;
  profession: ProviderProfession;
  signature: string | null;
  isPharmacyAvailability: boolean;
  isProgressAvailability: boolean;
  licenses: License[];
  timeZone: {
    label: string;
    value: string;
    options: TimeZone[];
  };
  bankingDetails: BankingDetails;
  paymentSettings: PaymentSettings;
  roles: UserResponseRole[];
}

export interface BankingDetails {
  accountHolder: string;
  bankName: string;
  bankAddress: string;
  accountNumber: string;
  routingNumber: string;
  [key: string]: string;
}

export interface PaymentSettings {
  syncVisit: {
    amount: string | number;
    currency: string;
  };
  aSyncVisit: {
    amount: string | number;
    currency: string;
  };
  refillVisit: {
    amount: string | number;
    currency: string;
  };
  payoutPeriod: {
    label: string;
    value: string;
    selected: string;
    valid: string;
  };
}

export interface UserResponseRole {
  description: string | null;
  handle: UserRole;
  id: number;
  name: string;
  uid: string;
}

export interface Addresses {
  shippingAddress: Address;
  billingAddress: Address;
}

export interface Address {
  countryCode?: string;
  administrativeArea: string;
  locality: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string | null;
  addressLine3?: string | null;
  id?: number;
  phone: string;
}

export interface AddressPayload {
  addressLine1: string;
  addressLine3?: string | null;
  fields: {
    addressFirstName: string;
    addressLastName: string;
    addressType: AddressType;
    phone?: string;
  };
  administrativeArea: string;
  locality: string;
  postalCode: string;
  addressId?: number;
  title?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
