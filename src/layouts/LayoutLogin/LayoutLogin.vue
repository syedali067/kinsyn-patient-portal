<script setup lang="ts">
import IconClose from '@/assets/icons/close.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import MainLogo from '@/components/MainLogo/MainLogo.vue';
import { useUserStore } from '@/stores/user';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

defineProps<{
  image: string;
}>();

const userStore = useUserStore();

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');
</script>

<template>
  <div
    class="row min-h-screen auto-rows-min gap-y-24 bg-white lg:auto-rows-auto"
    data-testpl="layout-login"
  >
    <header
      class="z-1 col-span-full flex h-64 w-full items-center justify-between gap-32 px-16 lg:absolute lg:h-112 lg:px-24"
    >
      <div class="flex" data-testpl="layout-login-logo">
        <MainLogo />
      </div>

      <BaseButton
        :href="userStore.baseUrl"
        size="32"
        color="gray"
        rounded
        data-testpl="layout-login-back-btn"
      >
        <template #prepend>
          <IconClose class="size-20" />
        </template>
      </BaseButton>
    </header>

    <figure
      class="relative col-span-full before:block before:pt-[100%] lg:col-span-6"
      v-if="greaterOrEqualLg"
    >
      <img
        class="rounded-4 absolute top-0 left-0 h-full w-full object-cover lg:rounded-none"
        :src="image"
        alt=""
        data-testpl="layout-login-image"
      />
    </figure>

    <main
      class="bg-site-bg col-span-full px-16 pb-64 lg:col-span-6 lg:-ml-24 lg:px-24 lg:py-112"
      data-testpl="layout-login-content"
    >
      <RouterView />
    </main>
  </div>
</template>
