import type { BodyPart } from '@/types/health';

export interface GroupedConditionsLabel {
  main: string;
  moreCount: number;
}

export type GroupedConditionsLabels = Partial<Record<BodyPart, GroupedConditionsLabel>>;
