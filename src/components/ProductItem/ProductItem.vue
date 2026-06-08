<script lang="ts" setup>
import type { ProductItemData } from './types.ts';
import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import IconRx from '@/assets/icons/rx.svg?component';
import SafeText from '@/components/SafeText/SafeText.vue';
import { productDescriptionOptions } from '@/utils/htmlSanitizerOptions.ts';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    product: ProductItemData;
    size?: 'md' | '';
    dataTestpl?: string;
    dataTestpls?: {
      link?: string;
      image?: string;
      imageHover?: string;
      category?: string;
      title?: string;
      description?: string;
      price?: string;
      button?: string;
    };
  }>(),
  {
    size: '',
    dataTestpl: 'pharmacy-product-slide',
    dataTestpls: () => ({
      link: 'pharmacy-product-slide-link-main',
      image: 'pharmacy-product-slide-img',
      imageHover: 'pharmacy-product-slide-img-hover',
      category: 'pharmacy-product-slide-category',
      title: 'pharmacy-product-slide-title',
      description: 'pharmacy-product-slide-description',
      price: 'pharmacy-product-slide-price',
      button: 'pharmacy-product-slide-button',
    }),
  },
);

const hoverActive = computed(() => !!props.product.imageHover);
const darkHover = computed(() => props.product.darkHover ?? false);

const sizeClass = computed(() => {
  if (props.size === 'md') {
    return 'lg:aspect-[426/364]';
  }
  return 'lg:aspect-[314/299]';
});

const textHoverClass = computed(() => {
  if (darkHover.value) {
    return 'group-hover:text-white';
  }
  if (hoverActive.value) {
    return 'group-hover:text-coal';
  }
  return '';
});

const textHoverCategoryClass = computed(() => {
  if (darkHover.value) {
    return 'duration-200 group-hover:text-white';
  }
  if (hoverActive.value) {
    return 'group-hover:text-coal/75';
  }
  return 'duration-200';
});
</script>

<template>
  <div
    class="group rounded-8 relative flex h-full flex-col justify-between overflow-hidden bg-white pb-20 lg:pb-24"
    :data-testpl="dataTestpl"
  >
    <div>
      <ul
        v-if="product.category"
        class="absolute top-0 right-0 left-0 z-1 flex min-h-13 w-full justify-between gap-4 px-24 py-20"
      >
        <li
          class="text-10 text-beige tracking-sm font-medium uppercase"
          :class="textHoverCategoryClass"
          :data-testpl="dataTestpls?.category"
        >
          {{ product.category }}
        </li>
      </ul>

      <figure
        class="bg-bone-secondary relative aspect-[272/248] w-full"
        :class="[
          sizeClass,
          hoverActive ? 'transition-opacity duration-200 group-hover:opacity-0' : '',
        ]"
        :data-testpl="dataTestpls?.image"
      >
        <img
          v-if="product.image"
          class="size-full object-cover"
          draggable="false"
          :src="product.image"
          :alt="product.name"
        />
      </figure>

      <figure
        v-if="hoverActive && product.imageHover"
        class="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        :data-testpl="dataTestpls?.imageHover"
      >
        <img
          class="size-full object-cover"
          draggable="false"
          :src="product.imageHover"
          :alt="product.name"
        />
      </figure>

      <div class="relative z-1">
        <div
          v-if="product.name"
          class="text-21 font-secondary mt-8 flex items-center gap-8 px-20 duration-200 lg:mt-16 lg:px-24"
          :class="textHoverClass"
          :data-testpl="dataTestpls?.title"
        >
          {{ product.name }}

          <IconRx
            v-if="product.rxOnly"
            class="text-beige size-20 duration-200"
            :class="textHoverClass"
          />
        </div>

        <SafeText
          v-if="product.description"
          :text="product.description"
          :options="productDescriptionOptions"
          class="text-14 text-secondary-text mt-12 line-clamp-2 px-20 duration-200 lg:px-24"
          :class="textHoverClass"
        />
      </div>
    </div>

    <div class="mt-16 flex flex-wrap items-end justify-between gap-x-10 px-20 lg:px-24">
      <a
        :href="product.link"
        class="rounded-8 absolute inset-0 z-2"
        :data-testpl="dataTestpls?.link"
      />

      <div class="relative z-1">
        <div class="flex flex-col gap-4">
          <p class="text-12 duration-200" :class="textHoverClass">
            {{ $t('from') }}
          </p>

          <p
            class="text-21 font-secondary mt-4 duration-200"
            :class="textHoverClass"
            :data-testpl="dataTestpls?.price"
          >
            {{ product.price }}
          </p>
        </div>
      </div>

      <i
        class="bg-coal relative z-1 mb-4 flex size-40 min-w-40 items-center justify-center rounded-full text-white duration-200"
        :class="hoverActive ? 'group-hover:text-coal group-hover:bg-white' : 'group-hover:bg-beige'"
        :data-testpl="dataTestpls?.button"
      >
        <IconArrowRight class="shrink-0" />
      </i>
    </div>
  </div>
</template>
