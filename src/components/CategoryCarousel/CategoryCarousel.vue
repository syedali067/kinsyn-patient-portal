<script lang="ts" setup>
import type { CategoryCarouselItem } from './types';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

defineProps<{
  categories: CategoryCarouselItem[];
  active?: boolean;
  isUncut?: boolean;
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');
</script>

<template>
  <swiper-container
    :slides-per-view="'auto'"
    :space-between="greaterOrEqualLg ? 24 : 16"
    :class="{
      'uncut-container': isUncut,
    }"
    data-testpl="pharmacy-product-category-swiper"
  >
    <swiper-slide
      v-for="category in categories"
      :key="category.id"
      class="w-min"
      data-testpl="pharmacy-product-category-slide"
    >
      <RouterLink
        :to="category.link"
        class="link"
        active-class="link-active"
        data-testpl="pharmacy-product-category-item"
      >
        <picture
          v-if="category.image"
          class="size-48 overflow-hidden rounded-full"
          data-testpl="pharmacy-product-category-picture"
        >
          <img
            :src="category.image"
            :alt="category.title"
            class="h-full w-full object-cover"
            data-testpl="pharmacy-product-category-image"
          />
        </picture>

        <span
          class="text-18 lg:text-21 text-medium whitespace-nowrap"
          data-testpl="pharmacy-product-category-title"
        >
          {{ category.title }}
        </span>
      </RouterLink>
    </swiper-slide>
  </swiper-container>
</template>

<style scoped>
@reference '@/assets/css/main.css';

.uncut-container::part(container) {
  @apply lg:overflow-visible;
}

.link {
  @apply rounded-8 bg-bone/50 flex h-80 items-center gap-16 border-1 border-transparent px-16 py-12 transition-colors lg:px-24 lg:py-12;
}

.link:hover {
  @apply border-beige;
}

.link-active {
  @apply pointer-events-none bg-black text-white;
}
</style>
