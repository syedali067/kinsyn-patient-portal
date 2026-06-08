<script setup lang="ts">
import IconChevronLeft from '@/assets/icons/chevron-left.svg?component';
import IconChevronRight from '@/assets/icons/chevron-right.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { useSwiper } from '@/composables/useSwiper';
import { CONTACT_LINK } from '@/constants/links';
import type { PharmacyCategory } from '@/types/pharmacy';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

defineProps<{
  pharmacyCategories?: PharmacyCategory[];
  title: string;
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const { isSwiperBeginning, isSwiperEnd, onSwiperSlideChange, onSwiperInit, prevSlide, nextSlide } =
  useSwiper();
</script>

<template>
  <section
    v-if="pharmacyCategories?.length"
    class="rounded-8 flex flex-col items-center bg-white py-24 lg:px-24 lg:py-64"
  >
    <div class="flex w-full flex-col gap-8 px-16 sm:items-center lg:gap-16 lg:pr-0">
      <h1 class="text-18 lg:text-26 lg:font-secondary">
        {{ title }}
      </h1>

      <p class="text-secondary-text text-14 lg:text-16 sm:text-center">
        <slot name="subtitle" />
      </p>

      <div class="flex flex-col gap-8">
        <p>
          {{ $t('haveMoreQuestions') }}
        </p>

        <BaseButton class="min-w-201 sm:w-fit" :href="CONTACT_LINK">
          {{ $t('contactCustomerSupport') }}
        </BaseButton>
      </div>
    </div>

    <div class="relative flex w-full items-center gap-24">
      <button
        v-if="!isSwiperBeginning && greaterOrEqualLg"
        type="button"
        class="text-coal hover:text-beige absolute top-1/2 left-0 z-10 flex size-44 -translate-y-1/2 items-center justify-center"
        @click="prevSlide"
        data-testpl="patient-treatments-slider-prev-btn"
      >
        <IconChevronLeft />
      </button>

      <swiper-container
        slides-per-view="auto"
        :space-between="greaterOrEqualLg ? 24 : 16"
        :mousewheel="{
          enabled: true,
          forceToAxis: true,
        }"
        class="mt-24 w-full px-16 lg:mt-56 lg:px-48"
        @swiperinit="onSwiperInit"
        @swiperslidechange="onSwiperSlideChange"
      >
        <swiper-slide
          v-for="category in pharmacyCategories"
          :key="category.id"
          class="max-w-260 lg:max-w-360"
          data-testpl="patient-treatments-slide"
        >
          <RouterLink
            :to="{
              name: 'PatientPharmacyCategory',
              params: {
                categorySlug: category.handle,
              },
            }"
            class="group rounded-8 relative flex min-h-360 flex-col justify-between overflow-hidden p-16 lg:min-h-502 lg:p-24"
          >
            <img
              class="absolute top-0 left-0 -z-1 h-full object-cover"
              :src="category.pharmacyThumb || ''"
              :alt="category.title"
              data-testpl="patient-treatments-slide-image"
            />

            <div class="to-brown absolute inset-0 z-1 bg-gradient-to-t from-transparent from-50%" />

            <span
              class="text-21 lg:text-26 font-secondary z-1 text-white"
              data-testpl="patient-treatments-slide-text"
            >
              {{ category.pharmacySlogan || category.title }}
            </span>

            <BaseButton color="light" group span data-testpl="patient-treatments-slide-shop-btn">
              {{ $t('shopAll') }}
            </BaseButton>
          </RouterLink>
        </swiper-slide>
      </swiper-container>

      <button
        v-if="!isSwiperEnd && greaterOrEqualLg"
        type="button"
        class="text-coal hover:text-beige absolute top-1/2 right-0 z-10 flex size-44 -translate-y-1/2 items-center justify-center"
        @click="nextSlide"
        data-testpl="patient-treatments-slider-next-btn"
      >
        <IconChevronRight />
      </button>
    </div>
  </section>
</template>
