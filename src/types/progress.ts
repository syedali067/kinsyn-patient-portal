import type { Attachment } from './attachment';
import { ProgressType } from '@/enums/progress';

interface ProgressMeta {
  upWeight: number;
  downWeight: number;
  quizWeight: number;
  milestoneWeight: number;
}

export interface ProgressCard {
  attachments: Attachment[] | [];
  dateCreated: Date;
  id: number;
  startedWeight: boolean;
  meta: ProgressMeta | null;
  type: ProgressType.Weight | ProgressType.Attachments;
}

export interface WeightProgressCard {
  id: number;
  value: number;
  date: Date;
}

export interface WeightProgress {
  goalWeight: number;
  firstWeight: number;
  userProgressData: WeightProgressCard[];
}
