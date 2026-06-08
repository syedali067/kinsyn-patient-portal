import type { CategorySlug, Treatment, TreatmentStatus } from './treatment';
import type { UserRole } from './user';
import type { TreatmentReviewStatus } from '@/enums/treatment';

export type ChatMessageAttachmentKind = 'pdf' | 'image' | 'word';

export interface ChatMessageSchedule {
  scheduleUrl: string;
}

export interface ChatMessageAttachment {
  id: number;
  url: string;
  title: string;
  filename: string;
  mimeType: string;
  kind: ChatMessageAttachmentKind;
  size: number;
  width: number;
  height: number;
}

export interface ChatTreatment {
  approvedByUserId: number | null;
  categorySlug: CategorySlug;
  dateApproved: Date | null;
  dateCanceled: Date | null;
  dateCreated: Date;
  dateDeclined: Date | null;
  dateDeleted: Date | null;
  dateUpdated: Date | null;
  description: string | null;
  id: number;
  isRenewalSubmissionRequired: boolean | null;
  name: string;
  patientId: number;
  plan: string | null;
  providerId: number | null;
  renewalSubmissionId: number | null;
  reviewStatus: TreatmentReviewStatus;
  reviewStatusUpdated: Date | null;
  status: TreatmentStatus;
  statusUpdated: Date | null;
  submissionId: number | null;
  subscriptionId: number | null;
  _subscriptionId: number | null;
  doseSpotUrl: string | null;
  chatId: number | null;
}

interface Staff {
  id: 0;
  username: string;
  npi: string;
  avatar: string;
  providerSignature: string;
  providerDisplayName: string;
  profession: string;
  deaNumber: string;
  fax: string;
}

export interface PatientChat {
  category: CategorySlug;
  countUnreadMessage: number;
  dateDeleted: Date;
  id: number;
  lastPatientMessage: NewChatMessage | null;
  lastProviderMessage: NewChatMessage | null;
  staff: Staff;
}

export interface NewChatMessage {
  id: number;
  chatId: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    avatar: string;
    profession?: string;
    roles: UserRole[];
  };
  message: string;
  attachments: ChatMessageAttachment[];
  isPatient: boolean;
  isReadByProvider: boolean;
  isReadByPatient: boolean;
  dateCreated: string;
  schedule?: ChatMessageSchedule;
  isPending?: boolean;
}

/* TODO: Delete after all chats requests use new data */
export interface ChatMessage {
  id: number;
  chatId: number;
  user: {
    id: number;
    fullName: string;
    avatarUrl: string | null;
    profession: string;
  };
  message: string;
  attachments: ChatMessageAttachment[];
  isReadByProvider: boolean;
  isReadByUser: boolean;
  dateCreated: string;
  schedule?: ChatMessageSchedule;
  categorySlug?: CategorySlug;
}

export interface Chat {
  id: number;
  patientId: number;
  providerId: number | null;
  treatmentId: number;
  treatment: Treatment;
  deprecated: boolean;
  category?: CategorySlug;
  enableChatBot?: boolean;
  lastPatientMessage?: ChatMessage;
  lastProviderMessage?: ChatMessage;
}
