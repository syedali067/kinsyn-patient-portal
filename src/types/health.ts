export type BodyPart =
  | 'head_and_brain'
  | 'throat_and_neck'
  | 'heart'
  | 'lungs'
  | 'breast_and_mammary'
  | 'upper_back'
  | 'lower_back'
  | 'abdomen'
  | 'kidneys'
  | 'pelvis'
  | 'shoulders'
  | 'arms_and_hands'
  | 'hips'
  | 'knees'
  | 'feet_and_ankles'
  | 'general_health';

export interface HealthInsightCondition {
  id: string;
  title: string;
  bodyPart: BodyPart;
  shortRecommendation: string;
  conditionName: string;
  icd10Code: string | null;
  updatedAt: string; // ISO date string
  createdAt: string; // ISO date string
  recommendation: string[];
  summary: Summary;
  findings: Findings;
  supplementRecommendations: SupplementRecommendation[];
  recommendedProducts: RecommendedProduct[];
  class?:
    | {
        dot: string;
        title: string;
      }
    | string;
}

export interface SupplementRecommendation {
  name: string;
  description: string;
}

export interface Findings {
  diagnosis: string;
  treatment: string;
  medications: string;
  symptoms: string;
  pastSurgeries: string;
}

export interface Summary {
  status: string;
  whyItMatters: string;
}

export interface RecommendedProduct {
  productId: number;
  category: string;
  description: string;
  reason: string;
  title: string;
  image: string;
  price: number;
  uri: string;
}

// Biomarkers

export interface BiomarkersCategory {
  name: string;
  inRange: number;
  outOfRange: number;
  improving: number;
  data: Biomarker[];
  about: string;
  slug: string;
  description: string;
}

export interface BiomarkersSummary {
  inRange: number;
  outOfRange: number;
  improving: number;
  description: string;
  insights: string;
  createdAt: string;
}

export interface Biomarker {
  rangeDescription: string;
  parameterName: string;
  parameterValue: string;
  parameterSubname: string | null;
  units: string;
  inRange: boolean | null;
  referenceRange: string;
  clinicalComments: string;
  insight: string;
  about: string;
  whyItMatters: string;
  description: string;
  progress: BiomarkerProgress[];
  isImproved: boolean;
  previousValues: BiomarkerProgress[];
}

export interface BiomarkerProgress {
  date: string;
  value: string;
}

// Appointments

export interface PatientAppointments {
  previous: PatientAppointmentItem[];
  upcoming: PatientAppointmentItem[];
}

export interface PatientAppointmentItem {
  id: string;
  confirmationId: string;
  appointmentStart: string;
  appointmentEnd: string;
  locationCode: string;
  locationId: string;
  locationName: string;
  locationAddress1: string;
  locationAddress2: string;
  locationCity: string;
  locationState: string;
  locationZip: string;
  timeZone: string;
  shortQRToken: string;
  longQRToken: string;
  patientId: number;
  firstName: string;
  lastName: string;
  activityId: string;
  status: 'booked' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
  documents?: {
    date: string;
    fileName: string;
    fileUri: string;
  }[];
}

// Biological Age

export interface BiologicalAge {
  dateOfBirth: string;
  chronologicalAge: number;
  omicAge: number;
  symphonyAge: number;
  agingPace: number;
  reportDate: string;
}
