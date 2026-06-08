<template>
  <div class="rounded-8 flex flex-col gap-24 bg-white p-16 lg:p-24 [&>*]:animate-pulse">
    <div class="bg-disabled-text h-32 w-2/3 rounded"></div>

    <div class="flex flex-col gap-16">
      <div v-for="i in 3" :key="i" class="flex items-center gap-16">
        <div class="bg-disabled-text rounded-8 size-88"></div>
        <div class="bg-disabled-text h-27 w-1/2 rounded"></div>
      </div>
    </div>

    <div class="bg-disabled-text rounded-6 h-44 w-full"></div>
  </div>
</template>
