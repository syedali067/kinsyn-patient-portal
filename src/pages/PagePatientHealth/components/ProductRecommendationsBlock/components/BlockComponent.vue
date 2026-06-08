<script setup lang="ts">
import IconArrowLeft from '@/assets/icons/arrow-left.svg?component';
import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import IconChevronRight from '@/assets/icons/chevron-right.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { useSwiper } from '@/composables/useSwiper';
import type { RecommendedProduct } from '@/types/health.ts';
import { formatPrice } from '@/utils/formatters';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import type { SwiperOptions } from 'swiper/types';
import { computed } from 'vue';

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');
const greaterOrEqualXl = breakpoints.greaterOrEqual('xl');

defineProps<{
  productRecommendations: RecommendedProduct[];
}>();

const {
  isSwiperBeginning,
  isSwiperEnd,
  onSwiperInit,
  onSwiperSlideChange,
  prevSlide,
  nextSlide,
  slidesCount,
} = useSwiper();

const SLIDES_PER_VIEW_XL = 3.5;
const SLIDES_PER_VIEW_LG = 2.5;

const slidesPerView = computed<SwiperOptions['slidesPerView']>(() =>
  greaterOrEqualXl.value
    ? SLIDES_PER_VIEW_XL
    : greaterOrEqualLg.value
      ? SLIDES_PER_VIEW_LG
      : 'auto',
);
</script>

<template>
  <section class="mb-40 flex flex-col gap-24">
    <div class="flex items-center justify-between gap-16">
      <h2 class="text-21 lg:text-26 font-secondary">
        {{ greaterOrEqualLg ? $t('productRecommendations') : $t('recommended') }}
      </h2>

      <!-- TODO: removed the "Add to Cart" button, as currently the logic for it is non-existent. -->
      <!-- <BaseButton theme="outline" size="37">
        <template #prepend>
          <IconShoppingBag class="size-20" />
        </template>

        {{ greaterOrEqualLg ? $t('addAllToCart') : $t('addAll') }}
      </BaseButton> -->
    </div>

    <div class="relative">
      <swiper-container
        :slides-per-view="slidesPerView"
        :space-between="greaterOrEqualLg ? 24 : 16"
        :mousewheel="{
          enabled: true,
          forceToAxis: true,
        }"
        @swiperinit="onSwiperInit"
        @swiperslidechange="onSwiperSlideChange"
      >
        <swiper-slide
          v-for="product in productRecommendations"
          :key="product.productId"
          class="flex h-full w-300 flex-col justify-between gap-16 lg:w-420"
        >
          <p class="text-14 line-clamp-4 h-[4.375rem] break-words">
            {{ product.reason }}
          </p>

          <div class="rounded-8 flex min-h-157 items-start gap-16 bg-white p-16 lg:items-center">
            <figure v-if="product.image" class="size-64 shrink-0">
              <img :src="product.image" :alt="product.title" />
            </figure>

            <div class="flex min-w-0 flex-col gap-4 lg:gap-8">
              <span class="text-10 text-beige font-medium uppercase">{{ product.category }}</span>

              <div class="flex items-center justify-between gap-8">
                <span class="lg:text-21 lg:font-secondary truncate" :title="product.title">
                  {{ product.title || '&nbsp;' }}
                </span>

                <span
                  v-if="greaterOrEqualLg && product.price"
                  class="flex shrink-0 items-baseline gap-4"
                >
                  <span class="text-10 text-stone">{{ $t('from') }}</span>

                  <span>{{ formatPrice(product.price) }}</span>
                </span>
              </div>

              <p class="text-12 text-secondary-text line-clamp-2 h-[1.875rem] break-words">
                {{ product.description }}
              </p>

              <span v-if="!greaterOrEqualLg && product.price" class="flex items-baseline gap-4">
                <span class="text-10 text-stone">{{ $t('from') }}</span>

                <span class="flex items-baseline"> {{ formatPrice(product.price) }} </span>
              </span>

              <div class="flex items-center justify-between gap-8">
                <BaseButton :href="`/${product.uri}`" theme="link">
                  {{ $t('learnMore') }}
                </BaseButton>

                <BaseButton :href="`/${product.uri}`" class="rounded-full" size="32">
                  <template #append>
                    <IconChevronRight class="size-20" />
                  </template>
                </BaseButton>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper-container>

      <template
        v-if="typeof slidesPerView === 'number' && slidesCount > slidesPerView && greaterOrEqualLg"
      >
        <BaseButton
          :class="[
            'product-recommendations-block-nav-button left-16 lg:left-24',
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
            'product-recommendations-block-nav-button right-16 lg:right-24',
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
  </section>
</template>

<style scoped>
@reference '@/assets/css/main.css';

swiper-container::part(container) {
  @apply -my-32 py-32;
}

.product-recommendations-block-nav-button {
  @apply absolute bottom-78 z-2 translate-y-1/2 transition-opacity;
}
</style>
