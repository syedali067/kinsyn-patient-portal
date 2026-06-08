import type { NumberedBoolean } from '@/types/api.ts';
import type { CategorySlug } from '@/types/treatment.ts';

export interface GetPharmacyPayload {
  onlyPopular?: NumberedBoolean;
  category?: CategorySlug;
}
