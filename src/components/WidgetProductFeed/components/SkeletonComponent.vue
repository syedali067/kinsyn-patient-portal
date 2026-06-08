<script setup lang="ts"></script>

<template>
  <div class="mt-24 lg:mt-0 [&>*]:animate-pulse">
    <div class="flex flex-col gap-24">
      <div class="flex items-center justify-between gap-16">
        <div class="bg-disabled-text h-32 w-1/3 rounded" />

        <div class="bg-disabled-text h-15 w-50 rounded" />
      </div>

      <div class="flex gap-24">
        <div class="bg-disabled-text h-450 w-360 shrink-0 rounded" />
        <div class="bg-disabled-text h-450 w-360 shrink-0 rounded" />
        <div class="bg-disabled-text h-450 w-360 shrink-0 rounded" />
      </div>
    </div>
  </div>
</template>
