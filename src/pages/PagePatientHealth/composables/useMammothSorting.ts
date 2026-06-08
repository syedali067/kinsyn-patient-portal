import type { Immunization } from '@/api/integrations/mammoth/types.ts';

export const sortByStartDate = <T extends { startDate: string | null }>(a: T, b: T): number => {
  const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
  const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;

  if (dateA === 0 && dateB === 0) return 0;
  if (dateA === 0) return 1;
  if (dateB === 0) return -1;

  return dateB - dateA;
};

export const sortByDate = (a: Immunization, b: Immunization): number => {
  const dateA = new Date(a.date).getTime();
  const dateB = new Date(b.date).getTime();
  return dateB - dateA;
};
