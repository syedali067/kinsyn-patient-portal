<script setup lang="ts">
import BaseSpinner from '@/components/BaseSpinner/BaseSpinner.vue';
import {
  duration,
  pageInTransition,
  pageOutTransition,
  loaderInTransition,
} from '@/utils/pageTransition.ts';

withDefaults(
  defineProps<{
    suspensible?: boolean;
    timeout?: number;
  }>(),
  {
    suspensible: true,
    timeout: duration,
  },
);
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Suspense
      :suspensible
      :timeout
      @pending="pageOutTransition"
      @fallback="loaderInTransition"
      @resolve="pageInTransition"
    >
      <component :is="Component" />

      <template #fallback>
        <div class="fixed inset-0 flex" data-loader-in="fadeIn">
          <BaseSpinner class="m-auto size-48" />
        </div>
      </template>
    </Suspense>
  </RouterView>
</template>
