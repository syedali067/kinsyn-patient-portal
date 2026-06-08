<script setup lang="ts">
import MainLogo from '@/components/MainLogo/MainLogo.vue';
</script>

<template>
  <div class="mx-auto flex flex-col gap-24">
    <MainLogo class="self-center" />

    <div class="text-12 flex items-center justify-center gap-42">
      <a href="/">
        <span class="text-coal flex shrink-0 items-center justify-center">
          {{ $t('telehealthConsent') }}
        </span>
      </a>
      <a href="/">
        <span class="text-coal flex shrink-0 items-center justify-center">
          {{ $t('privacyPolicy') }}
        </span>
      </a>
      <a href="/">
        <span class="text-coal flex shrink-0 items-center justify-center">
          {{ $t('cancellationPolicy') }}
        </span>
      </a>
      <a href="/">
        <span class="text-coal flex shrink-0 items-center justify-center">
          {{ $t('termsAndConditions') }}
        </span>
      </a>
    </div>
    <!--TODO: fix dynamic year-->
    <p class="text-10 text-center">©  2025 KINSYN™. {{ $t('allRightsReserved') }}.</p>
  </div>
</template>
