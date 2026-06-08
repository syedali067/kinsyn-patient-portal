import type { CategorySlug } from './treatment';

export type Gender = 'M' | 'F';

export type AuthMethod = 'TOTP' | 'RecoveryCode';

export type UserRole =
  | 'customerSupport'
  | 'customerSupportManagers'
  | 'medicalSupport'
  | 'medicalSupportManagers'
  | 'patients'
  | 'providerUsers' // Simple Providers
  | 'providers'; // Provider Managers

export type SessionUserRole = 'guest' | UserRole;
export type UserStatus = 'active' | 'inactive' | 'suspended';

// TODO: check any
export interface Profile {
  user: ProfileUser;
  /* licenses: any; */
  profession: {
    label: string;
    selected: boolean;
    valid: boolean;
    value: string;
  };
  avatar: string | null;
  signature: string;
  isPharmacyAvailability: boolean;
  hasPharmacyAccess: boolean;
  isProgressAvailability: boolean;
  timeZone: {
    label: string;
    value: string;
    options: TimeZone[];
  };
  shipping: {
    name: string;
    phone?: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  setupIntent: {
    clientSecret: string;
  };
  completedSubmissions: CategorySlug[];
  hasCompletedOnboarding?: boolean;
}

export interface ProfileUser {
  id: number;
  email: string;
  phone: string;
  dob?: number | null;
  gender: Gender | null;
  isSms: boolean;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  displayName: string | null;
  insuranceCardFront: string | null;
  insuranceCardBack: string | null;
  idPicture: string | null;
  document: string | null;
  /* addresses: any; */
  alternativeEmail: string;
  useAlternativeEmail: boolean;
  timezone: TimeZone;
  addresses: Addresses;
  consentEmailGeneralMarketing?: boolean;
  consentEmailPersonalizedQuiz?: boolean;
  consentEmailPersonalizedHealth?: boolean;
  consentSmsMarketing?: boolean;
  consentSmsTransactional?: boolean;
  smsStop?: boolean;
}

export interface Addresses {
  shippingAddress: Address | null;
  billingAddress: Address | null;
}

export interface TimeZone {
  label: string;
  selected: boolean;
  valid: boolean;
  value: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  avatar: string;
  phone: string;
  photo: string | null;
  avatarUrl: string;
  document: string | null;
  insuranceCardFront: string | null;
  insuranceCardBack: string | null;
  idPicture: string | null;
  userStatus: UserStatus;
  roles: UserRole[];
  profession: string | null;
}

export interface Address {
  addressFirstName: string;
  addressLastName: string;
  countryCode: string;
  administrativeArea: string;
  locality: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string | null;
  addressLine3?: string | null;
  id: number;
  phone: string;
}

export interface AccountAddress {
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  zip: string;
  state_code: string;
}

export interface ProviderProfession {
  label: string | null;
  selected: boolean;
  valid: boolean;
  value: string | null;
}
