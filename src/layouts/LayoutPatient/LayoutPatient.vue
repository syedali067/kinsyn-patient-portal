<script setup lang="ts">
import AnimatedRouterView from '@/components/AnimatedRouterView/AnimatedRouterView.vue';
import LayoutSidebar from '@/components/LayoutSidebar/LayoutSidebar.vue';
import PatientHeader from '@/components/PatientHeader/PatientHeader.vue';
import ShoppingCart from '@/components/ShoppingCart/ShoppingCart.vue';
import { useNavigation } from '@/composables/useNavigation.ts';
import { useOnboarding } from '@/composables/useOnboarding';
import { useChatsStore } from '@/stores/chats';
import { breakpointsTailwind, useBreakpoints, useWindowScroll } from '@vueuse/core';
import { computed, onMounted, onUnmounted, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

withDefaults(
  defineProps<{
    headerGradient?: boolean;
    fullHeight?: boolean;
  }>(),
  {
    headerGradient: true,
    fullHeight: false,
  },
);

const { isScrolling } = useWindowScroll();

const { navigationListPatientSidebar } = useNavigation();
const { startTour, shouldShowOnboarding, onboardingInit, isOnboardingInited } = useOnboarding();

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const route = useRoute();
const isCheckoutRoute = computed(() => route.name === 'Checkout');

const chatsStore = useChatsStore();

onMounted(() => {
  chatsStore.startTimer();
  onboardingInit();
});
onUnmounted(() => chatsStore.clearTimer());

watchEffect(() => {
  if (shouldShowOnboarding.value && greaterOrEqualLg.value && isOnboardingInited.value) {
    startTour();
  }
});
</script>

<template>
  <div
    class="bg-site-bg [&_*]:scroll-mt-header-height [&_*]:lg:scroll-mt-header-height-lg flex min-h-dvh flex-col items-center"
    :class="{
      'pointer-events-none [&_*]:pointer-events-none': isScrolling,
    }"
    data-testpl="layout-patient"
  >
    <ShoppingCart />

    <div
      class="grid w-full max-w-1440 grid-rows-[auto_1fr] lg:grid-cols-[96px_1fr]"
      :class="{
        'h-dvh': fullHeight,
        'grow gap-24 lg:gap-0': !fullHeight,
      }"
    >
      <PatientHeader
        class="z-1000 lg:col-span-full"
        :class="[
          headerGradient ? 'from-site-bg bg-linear-to-b from-80%' : 'bg-site-bg',
          {
            'sticky top-0': !fullHeight,
          },
        ]"
      />

      <LayoutSidebar
        v-if="greaterOrEqualLg && !isCheckoutRoute"
        :navigation="navigationListPatientSidebar"
        class="top-header-height-lg fixed z-1000"
      />

      <main
        class="min-h-0 w-full min-w-0 lg:pb-40"
        :class="{
          'px-16 pb-40': !fullHeight,
          'lg:col-span-full lg:px-32': isCheckoutRoute,
          'mx-auto max-w-1344 lg:col-start-2 lg:pr-24 lg:pl-0': !isCheckoutRoute,
        }"
        data-testpl="layout-patient-content"
      >
        <AnimatedRouterView />
      </main>
    </div>
  </div>
</template>
