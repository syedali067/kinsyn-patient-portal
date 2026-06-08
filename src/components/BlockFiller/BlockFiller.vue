<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import type { FunctionalComponent } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

withDefaults(
  defineProps<{
    title: string;
    icon?: FunctionalComponent;
    caption?: string;
    buttonLabel?: string;
    to?: RouteLocationRaw;
    tag?: string;
  }>(),
  {
    tag: 'section',
  },
);
</script>

<template>
  <component
    :is="tag"
    class="text-coal rounded-8 flex flex-col items-center gap-12 bg-white px-48 py-40 text-center lg:px-96"
  >
    <component v-if="icon" :is="icon" class="size-32" />

    <h2 class="mb-4 font-medium">
      {{ title }}
    </h2>

    <p v-if="caption" class="text-14 text-secondary-text">
      {{ caption }}
    </p>

    <BaseButton v-if="buttonLabel" :to class="mt-12">
      {{ buttonLabel }}
    </BaseButton>
  </component>
</template>
