<script lang="ts" setup>
import type { CategoryHeroData } from './types.ts';
import BaseButton from '@/components/BaseButton/BaseButton.vue';

withDefaults(
  defineProps<{
    hero: CategoryHeroData;
    isButtonHidden?: boolean;
    dataTestpls?: {
      image?: string;
      title?: string;
      caption?: string;
      button?: string;
    };
  }>(),
  {
    dataTestpls: () => ({
      image: 'pharmacy-product-hero-slide-image',
      title: 'pharmacy-product-hero-slide-title',
      caption: 'pharmacy-product-hero-slide-caption',
      button: 'pharmacy-product-hero-slide-button',
    }),
  },
);
</script>

<template>
  <div class="rounded-8 relative flex h-full flex-col gap-8 overflow-hidden p-24">
    <figure class="absolute top-0 left-0 z-0 h-full w-full">
      <img
        class="absolute top-0 left-0 h-full w-full object-cover"
        draggable="false"
        :src="hero.image"
        :alt="hero.title"
        :data-testpl="dataTestpls?.image"
      />

      <div class="bg-brown/45 absolute top-0 left-0 h-full w-full" />
    </figure>

    <p class="text-26 font-secondary relative mb-auto text-white" :data-testpl="dataTestpls?.title">
      {{ hero.title }}
    </p>

    <p v-if="hero.caption" class="text-14 relative text-white" :data-testpl="dataTestpls?.caption">
      {{ hero.caption }}
    </p>

    <BaseButton
      v-if="!isButtonHidden"
      class="relative"
      :to="hero.link"
      color="light"
      :data-testpl="dataTestpls?.button"
    >
      {{ $t('seeAll') }}
    </BaseButton>
  </div>
</template>
