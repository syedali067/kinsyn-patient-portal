<template>
  <section class="mb-40 flex flex-col gap-24">
    <div class="flex items-center justify-between gap-16">
      <div class="bg-disabled-text rounded-4 h-21 w-250 animate-pulse lg:h-26" />
    </div>

    <div class="flex gap-16 lg:gap-24">
      <div
        v-for="i in 3"
        :key="i"
        class="flex h-full w-300 animate-pulse flex-col justify-between gap-16 lg:w-420"
      >
        <div class="bg-disabled-text rounded-4 h-14 w-full" />
        <div class="rounded-8 flex min-h-157 items-start gap-16 bg-white p-16 lg:items-center">
          <div class="bg-disabled-text rounded-4 size-64 shrink-0" />
          <div class="flex w-full flex-col gap-4 lg:gap-8">
            <div class="bg-disabled-text rounded-4 h-10 w-100" />
            <div class="flex w-full items-center justify-between gap-8">
              <div class="bg-disabled-text rounded-4 h-16 w-120 lg:h-21" />
              <div class="bg-disabled-text rounded-4 h-16 w-60" />
            </div>
            <div class="bg-disabled-text rounded-4 h-12 w-full" />
            <div class="bg-disabled-text rounded-4 h-12 w-2/3" />
            <div class="flex items-center justify-between gap-8">
              <div class="bg-disabled-text rounded-4 h-32 w-100" />
              <div class="bg-disabled-text size-32 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-disabled-text rounded-4 h-20 w-100 animate-pulse lg:hidden" />
  </section>
</template>
