import type {
  Allergy,
  CarePlan,
  Condition,
  Encounter,
  FamilyHistory,
  Immunization,
  InsuranceProvider,
  LabResultGroup,
  Medication,
  Procedure,
  SocialHistory,
  VitalSign,
} from '@/api/integrations/mammoth/types.ts';
import type { TerraUserTerraInfoProvider } from '@/api/integrations/terra/types.ts';
import type { FunctionalComponent } from 'vue';

type TerraIcon = FunctionalComponent | string;

export type Interpretation = 'N' | 'L' | 'A' | 'LX' | 'H' | 'HX' | null;

export type MammothStatus = 'success' | 'pending' | 'failed';

export interface TerraMapping {
  title: string;
  values: TerraMetricValue[];
}

export interface TerraMetricValue {
  icon: TerraIcon;
  label: string;
  value: string | TerraMetricTime;
  measurementValue?: string;
  valueDiffLb?: number;
  valueDiffSleep?: TerraMetricTime | null;
  date: string;
}

export interface TerraMetricTime {
  hours: number;
  minutes: number;
  isNegative: boolean;
}

export interface TerraDevice {
  name: string;
  slug: TerraUserTerraInfoProvider;
  icon: TerraIcon;
  isConnected: boolean;
  loading: boolean;
}

export interface Patient {
  status: string;
  patientId: string;
  updatedAt: string;
  overview: object;
  vitalSigns: VitalSign[];
  procedures: Procedure[];
  medications: Medication[];
  socialHistories: SocialHistory[];
  insuranceProviders: InsuranceProvider[];
  allergies: Allergy[];
  familyHistories: FamilyHistory[];
  encounters: Encounter[];
  carePlans: CarePlan[];
  conditions: Condition[];
  labResultGroups: LabResultGroup[];
  labResults: LabResult[];
  immunization: Immunization[];
}

export interface MammothFields {
  isMammothAuth: boolean;
  filledFields: MammothFilledFields;
}

export interface MammothFilledFields {
  dob: boolean;
  firstName: boolean;
  gender: boolean;
  lastName: boolean;
  phone: boolean;
  billingAddress: MammothFieldsAddress;
  shippingAddress: MammothFieldsAddress;
}

export interface MammothFieldsAddress {
  state: boolean;
  city: boolean;
  postalCode: boolean;
  street: boolean;
  phone: boolean;
}

export interface LabResult {
  title?: string | null;
  location?: string | null;
  groupId: string;
  results: LabResulItem[];
}

export interface LabResulItem {
  id: string;
  interpretation: Interpretation;
  name: string;
  referenceRange: string;
  value: string;
  valueUnit: string;
}
