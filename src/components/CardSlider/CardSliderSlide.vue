<script setup lang="ts">
defineProps<{
  withBottomSpacing?: boolean;
}>();
</script>

<template>
  <swiper-slide
    data-testpl="card-slider-slide"
    :class="{
      'pb-80': withBottomSpacing,
    }"
  >
    <slot />
  </swiper-slide>
</template>
