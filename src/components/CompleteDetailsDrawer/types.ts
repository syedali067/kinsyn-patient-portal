import type { MammothGender } from '@/api/integrations/mammoth/types';
import type { ValidationRule } from '@vuelidate/core';

export interface FormData {
  gender: MammothGender;
  day: string;
  month: string;
  year: string;
  livingAddress: LivingAddress;
}

export interface LivingAddress {
  city: string;
  state: string;
  line: string;
  postalCode: string;
  phone?: string;
  apt?: string;
}

export type Rules = {
  [key: string]: ValidationRule | Rules;
};
