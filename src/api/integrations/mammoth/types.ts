export type AllergyType = 'Drug' | 'Non Drug';

export type MammothGender = 'male' | 'female' | undefined;

export interface VitalSign {
  vitalSign: string;
  resultValue: string;
}

export interface Allergy {
  allergy: string;
  reaction: string | null;
  date: string | null;
  id: string;
  status: string | null;
  type: AllergyType;
}

export interface FamilyHistory {
  conditions: FamilyHistoryCondition[];
  id: string;
  deceased: boolean;
  relationship: string;
}

export interface Procedure {
  id: string;
  startDate: string | null;
  status: string | null;
  stopDate: string | null;
  title: string;
}

export interface Medication {
  id: string;
  startDate: string | null;
  status: string;
  stopDate: string | null;
  title: string;
}

export interface SocialHistory {
  comment: string | null;
  description: string | null;
  id: string;
  startDate: string | null;
  stopDate: string | null;
  title: string | null;
}

export interface VitalSign {
  vitalSign: string;
  resultValue: string;
}

export interface InsuranceProvider {
  title: string | null;
  policyNo: string;
  contactNo: string | null;
  id: string;
  status: string | null;
}

export interface Encounter {
  title: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  status: string | null;
  id: string;
}

export interface CarePlan {
  title: string | null;
  date: string | null;
  id: string;
  activities: Activity[];
}

export interface Condition {
  endDate: string | null;
  icd10Code: string | null;
  id: string;
  startDate: string | null;
  status: string | null;
  title: string;
}

export interface LabResultGroup {
  id: string;
  location: string | null;
  title: string | null;
}

export interface Immunization {
  date: string;
  id: string;
  route: string | null;
  status: string;
  title: string;
}

export interface Activity {
  activity: string;
  endDate: string | null;
  id: string;
  startDate: string;
  status: string;
}

export interface FamilyHistoryCondition {
  comment: string | null;
  id: string;
  problem: string;
}

export interface MammothRegistrationPayload {
  firstName: string;
  lastName: string;
  phone: string;
  gender: MammothGender;
  dob: string;
  livingAddresses: LivingAddresses[];
}

export interface LivingAddresses {
  state: string;
  city: string;
  postalCode: string;
  line: string;
  phone: string;
  isCurrent: boolean;
}

export interface MammothRegistrationResponse {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: string;
}
