<script setup lang="ts">
import type { ProductImageSize } from './types';
import IconFemale from '@/assets/icons/female.svg?component';
import IconMale from '@/assets/icons/male.svg?component';
import IconRx from '@/assets/icons/rx.svg?component';
import type { Product } from '@/types/product';
import { computed } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

const props = withDefaults(
  defineProps<{
    image: string;
    isRx?: boolean;
    gender?: Product['gender'];
    size?: ProductImageSize;
    to?: RouteLocationRaw;
    href?: string;
  }>(),
  {
    size: '81',
  },
);

const isMale = computed(() => props.gender?.includes('M'));
const isFemale = computed(() => props.gender?.includes('F'));

const sizeClass = computed(() => {
  switch (props.size) {
    case '96':
      return 'h-120 w-96';

    case '81':
    default:
      return 'h-110 w-81';
  }
});

const component = computed(() => {
  if (props.to) {
    return 'RouterLink';
  }
  if (props.href) {
    return 'a';
  }

  return 'figure';
});
</script>

<template>
  <component
    :is="component"
    :to="to"
    :href="href"
    class="rounded-4 bg-sand/20 relative overflow-hidden p-8"
    :class="[sizeClass]"
  >
    <img draggable="false" class="h-full w-full object-contain" :src="image" :alt="''" />

    <IconRx v-if="isRx" class="pointer-events-none absolute top-8 left-8 size-16" />

    <span v-if="gender" class="pointer-events-none absolute top-8 right-8 bottom-0">
      <IconMale v-if="isMale" class="size-16" />
      <IconFemale v-else-if="isFemale" class="size-16" />
    </span>
  </component>
</template>
