<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { isGuest } = storeToRefs(userStore);
</script>

<template>
  <section class="flex h-full flex-col">
    <div class="m-auto w-full max-w-424">
      <h1 class="text-48 font-secondary">404</h1>

      <p class="text-18 lg:text-21 lg:font-secondary mt-12 lg:mt-16">
        {{ $t('pageNotFound') }}
      </p>

      <div class="text-14 text-secondary-text mt-24">
        <p>{{ $t('weCantFindThePage') }}</p>
        <p>{{ $t('probablyTheLinkIsBroken') }}</p>
      </div>

      <div class="mt-24 grid">
        <template v-if="isGuest">
          <BaseButton href="/" data-testpl="not-found-continue-shopping">
            {{ $t('goTo') }} {{ $t('home') }}
          </BaseButton>
        </template>

        <template v-else>
          <BaseButton :to="{ name: 'PatientPharmacy' }" data-testpl="not-found-continue-shopping">
            {{ $t('continueShopping') }}
          </BaseButton>

          <BaseButton
            :to="{ name: 'PatientHealth' }"
            class="mt-12"
            theme="outline"
            data-testpl="not-found-go-back-to-dashboard"
          >
            {{ $t('goBackToDashboard') }}
          </BaseButton>
        </template>
      </div>
    </div>
  </section>
</template>
