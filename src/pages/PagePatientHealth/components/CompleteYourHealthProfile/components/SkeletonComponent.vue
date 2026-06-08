<template>
  <div class="flex flex-col gap-16">
    <section class="lg:rounded-8 row gap-16 bg-white px-16 py-24 lg:gap-24">
      <div class="col-span-full flex flex-col gap-16 lg:col-span-4">
        <div class="bg-disabled-text rounded-4 h-26 w-300 animate-pulse" />

        <div class="bg-disabled-text rounded-4 h-96 w-100 shrink-0 animate-pulse" />

        <div class="relative w-full">
          <div
            class="rounded-4 bg-disabled-text absolute top-4 right-0 left-0 h-16 animate-pulse lg:right-8 lg:left-6"
          />
          <div class="flex w-full justify-between">
            <div v-for="i in 6" :key="i" class="flex flex-col items-center gap-4">
              <div class="border-sand h-24 w-1 border-l border-dashed" />
              <div
                v-if="i === 1 || i === 6"
                class="bg-disabled-text rounded-4 h-10 w-20 animate-pulse"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-8">
          <div
            v-for="i in 5"
            :key="i"
            class="rounded-4 bg-site-bg flex animate-pulse flex-row items-center justify-between gap-16 px-16 py-24 lg:flex-col lg:items-start lg:gap-8 lg:px-24"
          >
            <div class="bg-disabled-text rounded-4 h-21 w-200 animate-pulse" />
          </div>
        </div>
      </div>

      <div class="col-span-full hidden lg:col-span-8 lg:block">
        <div
          class="rounded-8 relative flex h-full min-h-656 animate-pulse items-center gap-24 overflow-hidden pl-64"
        >
          <div class="z-10 flex w-320 flex-col gap-16">
            <div class="bg-disabled-text rounded-4 h-32 w-full" />
            <div class="bg-disabled-text rounded-4 h-14 w-full" />
            <div class="bg-disabled-text rounded-4 h-14 w-2/3" />
            <div class="bg-disabled-text rounded-4 h-44 w-120" />
          </div>
          <div class="absolute top-0 right-0 h-full w-full">
            <div class="bg-disabled-text absolute top-0 right-0 h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
