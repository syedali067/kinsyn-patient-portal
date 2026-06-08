import type { Chat } from './chat';
import type { Prescription } from './prescription';
import type { Submission } from './submission';
import type { Subscription } from './subscription';
import type { ProviderProfession } from './user';
import type { TreatmentReviewStatus } from '@/enums/treatment';
import type { FunctionalComponent } from 'vue';

export type TreatmentStatus =
  | 'active'
  | 'paid_patient'
  | 'missing_information'
  | 'ready_to_review_new_patient'
  | 'prior_authorization'
  | 'awaiting_coverage'
  | 'compounding_patient'
  | 'active_patient_prescription_renews'
  | 'registered'
  | 'requires_two_way'
  | 'health_history'
  | 'intake_completed'
  | 'unresponsive'
  | 'two_way_before_approval'
  | 'pending_cancellation'
  | 'ready_to_review_refill'
  | 'waiting_on_client_for_prior_auth'
  | 'waiting_on_client_compound'
  | 'on_pause'
  | 'declined_authorization'
  | 'subscribed'
  | 'declined'
  | 'canceled'
  | 'nc_decline'
  | 'no_payment_method'
  | 'no_show';

export type TreatmentListTab =
  | 'all'
  | 'new_intake'
  | 'review_ready'
  | 'missing_information'
  | 'nc_decline'
  | 'awaiting_coverage'
  | 'active'
  | 'renewals'
  | 'unresponsive'
  | 'inactive';

export type CategorySlug =
  | 'pharmacy-purchase'
  | 'weight-management'
  | 'longevity'
  | 'dermatology'
  | 'weight-loss'
  | 'womens-health'
  | 'labs'
  | 'membership';

export type TreatmentPlanStatus = 'cancelled' | 'declined' | 'pending' | 'approved';

export interface Category {
  id: CategorySlug;
  label: string;
  icon: FunctionalComponent;
}

export interface ActionHistory {
  action: string;
  createdAt: Date;
  createdBy: string;
  createdById: number;
  id: number;
  provider: string;
  providerId: number;
  treatmentId: number;
}

export type TreatmentProvider = {
  fullName: string;
  id: number;
  profession?: ProviderProfession;
  photo?: {
    id: number;
    url: string;
  };
};

export interface Treatment {
  actionHistory: ActionHistory;
  approvedBy: string | null;
  id: number;
  status: TreatmentStatus;
  reviewStatus: TreatmentReviewStatus;
  subscription: Subscription | null;
  name: string;
  dateCreated: string;
  dateApproved: string | null;
  dateDeclined: string | null;
  dateUpdated: string | null;
  provider?: TreatmentProvider;
  providerId: number;
  prescriptions: Prescription[];
  subscriptionId: number;
  categorySlug: CategorySlug | null;
  renewalSubmissionId: number | null;
  isRenewalSubmissionRequired: boolean | null;
  submission: Submission | null;
  patientId: number;
  chatId: Chat['id'];
  journeys?: string[];
}

export type TreatmentProviderListItem = {
  id: number;
  patient: TreatmentPatient;
  name: string;
  state: string | null;
  status: TreatmentStatus;
  journeys: CategorySlug;
  treatmentsNames: { id: number; name: string }[];
  treatmentProviders: string[];
  prescriptions: TreatmentProviderPrescription[];
  plan: string | null;
  dateSubscription: string | null;
  lastMessageDate: string;
  dateCanceled: Date | null;
  provider: TreatmentProvider;
  timeLeft: number | null;
  pastDue: number | null;
  attemptsToContact: number;
  lastContact: string | null;
  lastAppointment: string | null;
  reviewStatus: TreatmentReviewStatus;
};

export type TreatmentProviderPrescription = {
  dosage: number;
  dosageUnit: string;
  id: number;
  productId: number;
  status: number | null;
  product: {
    id: number;
    title: string;
    url: string;
  };
};

export type TreatmentPatient = {
  age: number;
  avatar: string | null;
  bmi: number | null;
  email: string;
  fullName: string;
  gender: string;
  id: number;
  phone: string;
  stateUSA: string;
  status: number;
};
