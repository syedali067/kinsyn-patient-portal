export interface ProductItemData {
  id: number;
  name: string;
  description: string;
  link: string;
  rxOnly: boolean;
  price?: string;
  image?: string;
  imageHover?: string;
  category?: string;
  darkHover?: boolean;
}
