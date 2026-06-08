<script setup lang="ts">
import BlockComponent from './components/BlockComponent.vue';
import SkeletonComponent from './components/SkeletonComponent.vue';
import { useHealth } from '@/composables/useHealth.ts';

const { productRecommendations, isProductRecommendationsLoading, fetchProductRecommendations } =
  useHealth();

fetchProductRecommendations();
</script>

<template>
  <SkeletonComponent v-if="isProductRecommendationsLoading" :class="$attrs.class" />

  <BlockComponent
    v-else-if="productRecommendations && productRecommendations.length > 0"
    :product-recommendations="productRecommendations"
  />
</template>
