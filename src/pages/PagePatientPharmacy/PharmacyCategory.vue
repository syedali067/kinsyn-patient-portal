<script lang="ts" setup>
import IconArrowLeft from '@/assets/icons/arrow-left.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import CategoryCarousel from '@/components/CategoryCarousel/CategoryCarousel.vue';
import CategoryHero from '@/components/CategoryHero/CategoryHero.vue';
import ProductItem from '@/components/ProductItem/ProductItem.vue';
import ShoppingCartButton from '@/components/ShoppingCartButton/ShoppingCartButton.vue';
import { usePharmacyStore } from '@/stores/pharmacy/pharmacyStore.ts';
import type { CategorySlug } from '@/types/treatment.ts';
import { waitTransition } from '@/utils/pageTransition.ts';
import { heroMapper, productMapper, categoryMapper } from '@/utils/pharmacyMappers.ts';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const pharmacyStore = usePharmacyStore();
const { mainPharmacyProducts, mainPharmacyCategories } = storeToRefs(pharmacyStore);
const { getMainPharmacy } = pharmacyStore;

const route = useRoute();
const router = useRouter();
const categorySlug = computed(() => route.params.categorySlug as CategorySlug);
const categoryProducts = computed(
  () => mainPharmacyProducts.value[categorySlug.value]?.products ?? [],
);
const category = computed(() => mainPharmacyProducts.value[categorySlug.value]?.category);
const categoryHero = computed(() => (category.value ? heroMapper(category.value) : undefined));

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

await Promise.all([waitTransition(), getMainPharmacy()]);

onBeforeMount(() => {
  if (!category.value) {
    router.replace({ name: 'NotFound' });
  }
});
</script>

<template>
  <section class="row gap-y-24 lg:gap-y-40" data-page-in="fadeInUp" data-page-out="fadeOutUp">
    <div class="col-span-full flex items-center gap-12">
      <BaseButton
        color="light"
        rounded
        :to="{
          name: 'PatientPharmacy',
        }"
      >
        <template #prepend>
          <IconArrowLeft class="size-20" />
        </template>
      </BaseButton>

      <RouterLink
        :to="{
          name: 'PatientPharmacy',
        }"
        class="text-21 font-secondary"
      >
        {{ $t('goBack') }}
      </RouterLink>
    </div>

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

    <div class="row col-span-full gap-y-16 lg:gap-y-24">
      <CategoryHero
        is-button-hidden
        v-if="categoryHero && greaterOrEqualLg"
        :hero="categoryHero"
        class="col-span-4"
      />

      <ProductItem
        v-for="product in categoryProducts"
        :key="product.id"
        :product="productMapper(product)"
        class="col-span-4"
      />
    </div>

    <ShoppingCartButton />
  </section>
</template>
