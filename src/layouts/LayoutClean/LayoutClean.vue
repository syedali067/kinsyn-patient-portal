<script setup lang="ts">
import AnimatedRouterView from '@/components/AnimatedRouterView/AnimatedRouterView.vue';
import GuestHeader from '@/components/GuestHeader/GuestHeader.vue';
</script>

<template>
  <div class="bg-site-bg flex min-h-screen flex-col items-center" data-testpl="layout-clean">
    <div class="mx-auto grid w-full max-w-1440 grow grid-rows-[auto_1fr]">
      <GuestHeader />

      <main class="px-16 pb-40 lg:px-32" data-testpl="layout-clean-content">
        <AnimatedRouterView />
      </main>
    </div>
  </div>
</template>
