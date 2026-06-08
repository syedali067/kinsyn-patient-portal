import type { QuizCategory } from '@/types/quiz.ts';
import type { Gender } from '@/types/user.ts';
import type { Variant } from '@/types/variant.ts';

export type ProductType =
  | 'pill'
  | 'tube'
  | 'troche'
  | 'digital'
  | 'addOn'
  | 'injection'
  | 'suppository'
  | 'sprayEmulsion'
  | 'cap'
  | 'filmEr';

export interface Product {
  id: number;
  type: string;
  productType?: ProductType;
  heading: string;
  clarification: string;
  title: string;
  display: boolean;
  fullfillmentType: string;
  shippingAmount: number;
  status: string;
  url: string;
  image?: {
    id: number;
    url: string | null;
  };
  quizCategory: Pick<QuizCategory, 'id' | 'slug' | 'title'>;
  variants: Variant[];
  dosages: number[];
  dosageUnit: string;
  quantityList?: number[];
  injectionAck: boolean;
  rxOnly: boolean;
  gender: Gender[];
  // Multiselect only
  $isDisabled?: boolean;
}
