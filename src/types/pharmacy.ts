import type { CategorySlug } from './treatment';
import type { ProductType } from '@/types/product';
import type { Variant } from '@/types/variant';

export interface PharmacyCategory {
  categoryPath: string | null;
  completed: boolean;
  handle: CategorySlug;
  id: number;
  image: string | undefined;
  pharmacyThumb: string | null;
  pharmacyDetail: string | null;
  pharmacySlogan: string | null;
  preview?: string;
  title: string;
  heading: string | null;
}

export interface CurrentPlanProduct {
  amount: number;
  id: number;
  productId: number;
  quantity: number;
  subscriptionId: number;
  total: number;
  variant: Variant;
  variantId: number;
  treatmentId: number;
}

export interface ShippingPrice {
  id: number;
  productIds: number[];
  shippingAmount: number;
  title: string;
}

export interface PharmacyProductOverview {
  fields: {
    heading: string;
    simpleText?: string;
    description?: string;
    image?: string;
  };
  id: number;
  type: string;
}

export interface PharmacyProduct {
  clarification: string | null;
  contentText: string | null;
  currentPlan: CurrentPlanProduct | null;
  description: string | null;
  disclaimer: string | null;
  display: boolean;
  label: string;
  dosageUnit: string;
  dosages?: string[];
  quantityList?: number[];
  fullfillmentType?: string | null;
  shippingPrices: ShippingPrice[];
  gender?: string[];
  heading: string | null;
  headingInfo: string | null;
  id: number;
  image: {
    id: number;
    url: string;
  } | null;
  imageHover: {
    id: number;
    url: string;
  } | null;
  injectionAck: boolean;
  isPopular: boolean;
  onlyForPrescribedPatients: boolean;
  productOverview: PharmacyProductOverview[] | null;
  productUsage: string[];
  productType?: ProductType[];
  quizCategory?: {
    id: number;
    slug: CategorySlug;
    title: string;
  };
  isQuizCategoryCompleted: boolean;
  isQuizCategoryApproved: boolean;
  isDisplayedFromPrescription: boolean;
  rxOnly: boolean;
  shippable: boolean;
  status: string;
  title: string;
  type: string | null;
  underheading: string | null;
  url: string;
  variants: Variant[];
  darkHover?: boolean;
}

export interface Pharmacy {
  categories: PharmacyCategory[];
  products: PharmacyProduct[];
  disabled: boolean;
}

export interface MyPharmacy {
  IsDefault: boolean;
  PharmacyId: number;
  StoreName: string;
  Address1: string;
  Address2: string;
  City: string;
  State: string;
  ZipCode: string;
  PrimaryPhone: string;
  PrimaryPhoneType: string;
  PrimaryFax: string;
  PhoneAdditional1: string | null;
  PhoneAdditionalType1: string;
  PhoneAdditional2: string | null;
  PhoneAdditionalType2: string;
  PhoneAdditional3: string | null;
  PhoneAdditionalType3: string;
  PharmacySpecialties: Array<string>;
  ServiceLevel: number;
  Latitude: number;
  Longitude: number;
  NCPDPID: string;
}
