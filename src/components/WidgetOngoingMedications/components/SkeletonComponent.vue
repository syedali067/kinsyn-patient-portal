<template>
  <div class="rounded-8 flex animate-pulse flex-col gap-24 bg-white p-16 lg:gap-32 lg:p-24">
    <div class="bg-disabled-text h-65 w-full rounded" />
    <div class="bg-disabled-text h-15 w-2/3 rounded" />
    <div class="flex flex-col gap-32">
      <div v-for="i in 2" :key="i" class="flex h-45 items-center justify-between gap-12">
        <div class="bg-disabled-text h-full w-2/3 rounded" />
        <div class="bg-disabled-text size-32 shrink-0 rounded-full" />
      </div>
    </div>
  </div>
</template>
