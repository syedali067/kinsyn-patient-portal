<script setup lang="ts">
import MainLogo from '@/components/MainLogo/MainLogo.vue';
</script>

<template>
  <header
    class="h-header-height lg:h-header-height-lg flex items-center px-16 lg:px-32"
    data-testpl="guest-header"
  >
    <div
      class="flex w-full justify-center lg:justify-start"
      data-testpl="guest-header-logo-wrapper"
    >
      <MainLogo />
    </div>
  </header>
</template>
