import type { QuizCategory } from './quiz';

export type SubmissionStatus = 'in progress' | 'completed' | 'declined';

export type SubmissionAnswerTag = 'none' | 'concern' | 'terminate';

export type SubmissionAnswerType =
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'radioUses'
  | 'radioShipments'
  | 'input'
  | 'maskInput'
  | 'states'
  | 'commercePlan'
  | 'commerceProduct'
  | 'fileInput'
  | 'allergies';

export interface SubmissionOption {
  id: number;
  value: string;
  answerTag: SubmissionAnswerTag;
}

export interface SubmissionAnswer {
  id: number | null;
  answerId: number | number[] | null;
  question: string | null;
  answer: string | null;
  slug: string | null;
  isEditable: boolean;
  tag: SubmissionAnswerTag | null;
  type: SubmissionAnswerType;
  options?: SubmissionOption[];
}

export interface Submission {
  id: number;
  patientId: number;
  status: SubmissionStatus;
  handle: string;
  name: string;
  quizCategories: QuizCategory;
  answers: SubmissionAnswer[];
}
