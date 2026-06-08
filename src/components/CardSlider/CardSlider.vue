<script setup lang="ts">
import IconArrowLeft from '@/assets/icons/arrow-left.svg?component';
import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { useSwiper } from '@/composables/useSwiper';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { Navigation, Pagination } from 'swiper/modules';
import { computed } from 'vue';

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const {
  isSwiperBeginning,
  isSwiperEnd,
  onSwiperSlideChange,
  onSwiperInit,
  prevSlide,
  nextSlide,
  slidesCount,
} = useSwiper();

const isNavigationShowed = computed(() => slidesCount.value > 1);
</script>

<template>
  <div class="relative">
    <swiper-container
      :modules="[Navigation, Pagination]"
      :slides-per-view="1"
      :space-between="24"
      :pagination="slidesCount > 1 ? { clickable: true, dynamicBullets: true } : false"
      :navigation="{
        nextEl: '.card-slider-next-button',
        prevEl: '.card-slider-prev-button',
      }"
      class="swiper [&_*]:user-select-none relative size-full"
      data-testpl="card-slider-container"
      @swiperinit="onSwiperInit"
      @swiperslidechange="onSwiperSlideChange"
    >
      <slot />
    </swiper-container>

    <template v-if="isNavigationShowed && greaterOrEqualLg">
      <BaseButton
        class="card-slider-prev-button absolute bottom-24 left-1/2 z-2 -translate-x-84"
        size="32"
        rounded
        :disabled="isSwiperBeginning"
        data-testpl="card-slider-prev-btn"
        @click="prevSlide"
      >
        <template #append>
          <IconArrowLeft class="size-20" />
        </template>
      </BaseButton>

      <BaseButton
        class="card-slider-next-button absolute bottom-24 left-1/2 z-2 translate-x-52"
        size="32"
        rounded
        :disabled="isSwiperEnd"
        data-testpl="card-slider-next-btn"
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

.swiper::part(pagination) {
  @apply absolute bottom-32 left-1/2 z-3 flex h-16 items-center justify-center;
}

.swiper::part(bullet),
.swiper::part(bullet-active) {
  @apply mx-2 size-8 shrink-0 cursor-pointer rounded-full transition-all;
}

.swiper::part(bullet) {
  @apply bg-black/25;
}
.swiper::part(bullet):hover {
  @apply bg-black/50;
}
.swiper::part(bullet-active) {
  @apply bg-black;
}
</style>
