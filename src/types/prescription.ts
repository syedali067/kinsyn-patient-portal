export interface PrescriptionImage {
  id: number;
  url: string;
}

export interface PrescriptionProduct {
  id: number;
  productActiveIngredient: string | null;
  title: string;
  description: string | null;
  url: string;
  image: PrescriptionImage | null;
  isMain: boolean;
  rxOnly: boolean;
  shippable: boolean;
  planTitle: string;
  planId: number | null;
  isDisplayedFromPrescription: boolean;
}

export interface Prescription {
  id: number;
  productId: number;
  dosage: number;
  dosageUnit: string | null;
  status: number;
  product: PrescriptionProduct;
}
