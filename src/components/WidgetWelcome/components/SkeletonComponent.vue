<script setup lang="ts">
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
</script>

<template>
  <div class="rounded-8 flex flex-col gap-32 bg-white p-24 lg:h-367 [&>*]:animate-pulse">
    <div class="flex flex-col gap-16 lg:gap-12">
      <div class="bg-disabled-text h-32 w-full max-w-300"></div>
      <div class="bg-disabled-text h-18 w-full max-w-200"></div>
    </div>

    <div class="flex flex-col gap-16">
      <div class="flex items-center justify-between gap-8">
        <div class="bg-disabled-text h-18 w-full max-w-175"></div>
        <div class="bg-disabled-text h-32 w-32 shrink-0 rounded-full"></div>
      </div>

      <BaseSeparator class="bg-bone" />

      <div class="flex items-center justify-between gap-8">
        <div class="bg-disabled-text h-18 w-full max-w-200"></div>
        <div class="bg-disabled-text h-32 w-32 shrink-0 rounded-full"></div>
      </div>
    </div>
  </div>
</template>
