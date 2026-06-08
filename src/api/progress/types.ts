import type { ProgressType } from '@/enums/progress';
import type { PaginationPayload } from '@/types/pagination';

export interface WeightProgressPayload {
  type: ProgressType.Weight;
  weight: number;
  userId?: number;
}

export interface GetProgressPayload extends PaginationPayload {
  userId: number;
}
