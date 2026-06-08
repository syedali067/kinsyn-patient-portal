<script lang="ts" setup>
import IconArrowLeft from '@/assets/icons/arrow-left.svg?component';
import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import CategoryHero from '@/components/CategoryHero/CategoryHero.vue';
import type { CategoryHeroData } from '@/components/CategoryHero/types.ts';
import ProductItem from '@/components/ProductItem/ProductItem.vue';
import type { ProductItemData } from '@/components/ProductItem/types.ts';
import { useSwiper } from '@/composables/useSwiper';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import type { SwiperOptions } from 'swiper/types';
import { computed } from 'vue';

withDefaults(
  defineProps<{
    products: ProductItemData[];
    hero?: CategoryHeroData;
    isUncut?: boolean;
    showNavigation?: boolean;
    dataTestpls?: {
      heroSlide?: string;
      heroSlideImage?: string;
      heroSlideTitle?: string;
      heroSlideCaption?: string;
      heroSlideButton?: string;
      slide?: string;
      link?: string;
      category?: string;
      image?: string;
      title?: string;
      description?: string;
      price?: string;
      button?: string;
    };
  }>(),
  {
    isUncut: false,
    showNavigation: true,
    dataTestpls: () => ({
      heroSlide: 'pharmacy-product-hero-slide',
      heroSlideImage: 'pharmacy-product-hero-slide-image',
      heroSlideTitle: 'pharmacy-product-hero-slide-title',
      heroSlideCaption: 'pharmacy-product-hero-slide-caption',
      heroSlideButton: 'pharmacy-product-hero-slide-button',
      slide: 'pharmacy-product-slide',
      link: 'pharmacy-product-slide-link-main',
      category: 'pharmacy-product-slide-category',
      image: 'pharmacy-product-slide-image',
      title: 'pharmacy-product-slide-title',
      description: 'pharmacy-product-slide-description',
      price: 'pharmacy-product-slide-price',
      button: 'pharmacy-product-slide-button',
    }),
  },
);

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const {
  isSwiperBeginning,
  isSwiperEnd,
  onSwiperInit,
  onSwiperSlideChange,
  prevSlide,
  nextSlide,
  slidesCount,
} = useSwiper();

const SLIDES_PER_GROUP = 3;

const slidesPerGroup = computed<SwiperOptions['slidesPerGroup']>(() =>
  greaterOrEqualLg.value ? SLIDES_PER_GROUP : 1,
);
</script>

<template>
  <div class="product-carousel-container">
    <swiper-container
      :class="{
        'uncut-container': isUncut,
      }"
      slides-per-view="auto"
      :space-between="greaterOrEqualLg ? 24 : 16"
      :mousewheel="{
        enabled: true,
        forceToAxis: true,
      }"
      :slides-per-group="slidesPerGroup"
      @swiperinit="onSwiperInit"
      @swiperslidechange="onSwiperSlideChange"
    >
      <swiper-slide
        v-if="hero"
        class="h-auto max-w-264 transition-shadow hover:shadow-md md:max-w-360"
        :data-testpl="dataTestpls?.heroSlide"
      >
        <CategoryHero
          :hero="hero"
          :data-testpls="{
            image: dataTestpls?.heroSlideImage,
            title: dataTestpls?.heroSlideTitle,
            caption: dataTestpls?.heroSlideCaption,
            button: dataTestpls?.heroSlideButton,
          }"
        />
      </swiper-slide>

      <swiper-slide
        v-for="product in products"
        :key="product.id"
        class="h-auto max-w-264 md:max-w-360"
        :data-testpl="dataTestpls?.slide"
      >
        <ProductItem
          class="h-full transition-shadow hover:shadow-md"
          :product
          :data-testpls="{
            link: dataTestpls?.link,
            category: dataTestpls?.category,
            image: dataTestpls?.image,
            title: dataTestpls?.title,
            description: dataTestpls?.description,
            price: dataTestpls?.price,
            button: dataTestpls?.button,
          }"
        />
      </swiper-slide>
    </swiper-container>

    <template v-if="showNavigation && slidesCount > SLIDES_PER_GROUP && greaterOrEqualLg">
      <BaseButton
        :class="[
          'product-carousel-nav-button left-16 lg:left-24',
          {
            'pointer-events-none opacity-0': isSwiperBeginning,
          },
        ]"
        size="40"
        rounded
        color="gray"
        @click="prevSlide"
      >
        <template #append>
          <IconArrowLeft class="size-20" />
        </template>
      </BaseButton>

      <BaseButton
        :class="[
          'product-carousel-nav-button right-16 lg:right-24',
          {
            'pointer-events-none opacity-0': isSwiperEnd,
          },
        ]"
        size="40"
        rounded
        color="gray"
        @click="nextSlide"
      >
        <template #append>
          <IconArrowRight class="size-20" />
        </template>
      </BaseButton>
    </template>
  </div>
</template>

<style scoped>
@reference '@/assets/css/main.css';

.product-carousel-container {
  @apply relative;
}

.product-carousel-nav-button {
  @apply absolute top-1/2 z-2 transition-opacity;
}

swiper-container::part(container) {
  @apply -my-32 py-32;
}

.uncut-container::part(container) {
  @apply lg:overflow-visible;
}
</style>
