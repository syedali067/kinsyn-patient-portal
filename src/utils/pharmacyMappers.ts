import type { CategoryCarouselItem } from '@/components/CategoryCarousel/types.ts';
import type { CategoryHeroData } from '@/components/CategoryHero/types.ts';
import type { ProductItemData } from '@/components/ProductItem/types.ts';
import type { PharmacyCategory, PharmacyProduct } from '@/types/pharmacy.ts';
import { startingAtFromVariants } from '@/utils/formatters.ts';

export const productMapper = (product: PharmacyProduct): ProductItemData => {
  const price = startingAtFromVariants(product.variants);

  return {
    id: product.id,
    image: product.image?.url,
    imageHover: product.imageHover?.url,
    category: product.quizCategory?.title,
    name: product.title,
    description: product.description || product.underheading || '',
    price: price?.startingAt || price?.amount,
    link: product.url,
    rxOnly: product.rxOnly,
    darkHover: product.darkHover ?? false,
  };
};

export const categoryMapper = (category: PharmacyCategory): CategoryCarouselItem => ({
  id: category.id,
  title: category.title,
  image: category.pharmacyThumb || '',
  link: {
    name: 'PatientPharmacyCategory',
    params: {
      categorySlug: category.handle,
    },
  },
});

export const heroMapper = (category: PharmacyCategory): CategoryHeroData => ({
  title: category.title || '',
  caption: category.pharmacySlogan || '',
  image: category.pharmacyThumb || undefined,
  link: category.handle
    ? {
        name: 'PatientPharmacyCategory',
        params: {
          categorySlug: category.handle,
        },
      }
    : undefined,
});
