<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import ProductCarousel from '@/components/ProductCarousel/ProductCarousel.vue';
import type { PharmacyProduct } from '@/types/pharmacy.ts';
import { productMapper } from '@/utils/pharmacyMappers.ts';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

defineProps<{
  products: PharmacyProduct[];
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');
</script>

<template>
  <section class="mt-24 lg:mt-0">
    <div class="flex flex-col gap-24" data-testpl="dashboard-progress-completion">
      <div class="flex items-center justify-between gap-16">
        <h2 class="text-26 font-secondary" data-testpl="card-header">
          {{ $t('getMoreFrom') }}
          <br v-if="!greaterOrEqualLg" />
          KINSYN
        </h2>

        <BaseButton theme="link" :to="{ name: 'PatientPharmacy' }" data-testpl="card-button">
          {{ $t('seeAll') }}
        </BaseButton>
      </div>

      <ProductCarousel class="-mr-16 lg:-mr-24" :products="products.map(productMapper)" />
    </div>
  </section>
</template>
