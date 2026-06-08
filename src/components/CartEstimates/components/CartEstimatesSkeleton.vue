<script setup lang="ts">
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';

withDefaults(
  defineProps<{
    isMembership?: boolean;
    isCoupon?: boolean;
  }>(),
  {
    isMembership: false,
    isCoupon: false,
  },
);
</script>

<template>
  <div class="[&>*]:animate-pulse">
    <div class="flex justify-between gap-12">
      <div class="bg-disabled-text h-18 w-55"></div>
      <div class="bg-disabled-text h-18 w-60"></div>
    </div>

    <div v-if="isMembership" class="mt-24 flex justify-between gap-12">
      <div class="bg-disabled-text h-18 w-135"></div>
      <div class="bg-disabled-text h-18 w-50"></div>
    </div>

    <div v-if="isCoupon" class="mt-24 flex items-start justify-between gap-12">
      <div>
        <div class="bg-disabled-text h-18 w-95"></div>
        <div class="bg-disabled-text mt-4 h-15 w-115"></div>
      </div>
      <div class="bg-disabled-text h-18 w-60"></div>
    </div>

    <div class="mt-24 flex items-start justify-between gap-12">
      <div class="bg-disabled-text h-18 w-65"></div>
      <div class="bg-disabled-text h-18 w-50"></div>
    </div>

    <BaseSeparator class="bg-bone mt-24" />

    <div class="mt-16 flex justify-between gap-12">
      <div class="bg-disabled-text h-23 w-45"></div>
      <div class="bg-disabled-text h-23 w-60"></div>
    </div>
  </div>
</template>
