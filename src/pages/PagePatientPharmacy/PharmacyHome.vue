<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import CategoryCarousel from '@/components/CategoryCarousel/CategoryCarousel.vue';
import ProductCarousel from '@/components/ProductCarousel/ProductCarousel.vue';
import ShoppingCartButton from '@/components/ShoppingCartButton/ShoppingCartButton.vue';
import { usePharmacyStore } from '@/stores/pharmacy/pharmacyStore.ts';
import { waitTransition } from '@/utils/pageTransition.ts';
import { categoryMapper, heroMapper, productMapper } from '@/utils/pharmacyMappers.ts';
import { storeToRefs } from 'pinia';

const pharmacyStore = usePharmacyStore();
const { mainPharmacyProducts, mainPharmacyCategories, popularPharmacyProducts } =
  storeToRefs(pharmacyStore);
const { getMainPharmacy, getPopularPharmacy } = pharmacyStore;

await Promise.all([waitTransition(), getMainPharmacy(), getPopularPharmacy()]);
</script>

<template>
  <div data-page-in="fadeInUp" data-page-out="fadeOutUp">
    <div class="row mb-40 lg:mb-56">
      <div class="col-span-full flex flex-col gap-24" data-testpl="categories-block">
        <h3 class="text-26 font-secondary" data-testpl="categories-title">
          {{ $t('categories') }}
        </h3>

        <CategoryCarousel
          class="-mr-16 lg:-mr-24"
          :categories="mainPharmacyCategories.map(categoryMapper)"
          is-uncut
        />
      </div>
    </div>

    <div class="row mb-40 lg:mb-56">
      <div
        v-if="popularPharmacyProducts.length > 0"
        class="col-span-full flex flex-col gap-24"
        data-testpl="pharmacy-products-block"
      >
        <h3 class="text-26 font-secondary" data-testpl="pharmacy-products-title">
          {{ $t('popular') }}
        </h3>

        <ProductCarousel
          class="-mr-16 lg:-mr-24"
          :products="popularPharmacyProducts.map(productMapper)"
        />
      </div>
    </div>

    <div class="row">
      <template v-for="(data, categorySlug) in mainPharmacyProducts" :key="categorySlug">
        <div
          v-if="data"
          class="col-span-full mb-40 flex flex-col gap-24 last:mb-82 lg:mb-56"
          data-testpl="pharmacy-products-block"
        >
          <div v-if="data.category" class="flex items-center justify-between gap-16">
            <h3 class="text-26 font-secondary" data-testpl="pharmacy-products-title">
              {{ data.category.title }}
            </h3>

            <BaseButton
              v-if="categoryMapper(data.category).link"
              theme="link"
              :to="categoryMapper(data.category).link"
              data-testpl="see-all-button"
            >
              {{ $t('seeAll') }}
            </BaseButton>
          </div>

          <ProductCarousel
            class="-mr-16 lg:-mr-24"
            :products="data.products.map(productMapper)"
            :hero="heroMapper(data.category)"
          />
        </div>
      </template>
    </div>

    <ShoppingCartButton />
  </div>
</template>
