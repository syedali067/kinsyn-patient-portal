<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { useUserStore } from '@/stores/user';
import { pushDataLayerEvent } from '@/utils/dataLayer';
import { useScriptTag } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userStore = useUserStore();
const { isGuest } = storeToRefs(userStore);

const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
const gtmId = import.meta.env.VITE_ANALYTICS_GTM_ID;

const hasAnalytics = computed(() => {
  return endpoint && gtmId;
});

if (hasAnalytics.value) {
  const cid = route.query.cid;
  const cartId = Array.isArray(cid) ? (cid[0] ?? '') : (cid ?? '');
  pushDataLayerEvent('Order Completed', userStore.email || '', cartId).catch(() => {});
  useScriptTag(`${endpoint}gtm.js?id=${gtmId}`);
}
</script>

<template>
  <Teleport v-if="hasAnalytics" to="body">
    <noscript>
      <iframe
        :src="`${endpoint}ns.html?id=${gtmId}`"
        height="0"
        width="0"
        style="display: none; visibility: hidden"
      />
    </noscript>
  </Teleport>

  <section class="flex h-full flex-col" data-page-in="fadeInUp" data-page-out="fadeOutUp">
    <div class="m-auto w-full max-w-424">
      <h1 class="text-26 lg:text-32 font-secondary">
        {{ $t('thankYouForYourPurchase') }}
      </h1>
      <p class="text-18 lg:text-21 lg:font-secondary mt-12 lg:mt-16">
        {{ $t('orderIsOnYourWay') }}
      </p>
      <p v-if="!isGuest" class="text-14 text-secondary-text mt-24">
        {{ $t('youCanTrackYourOrderWithTheButtonBelow') }}
      </p>

      <div class="mt-24 grid">
        <BaseButton v-if="isGuest" :to="{ name: 'Login' }" data-testpl="thank-you-go-to-home">
          {{ $t('goTo') }} {{ $t('home') }}
        </BaseButton>

        <template v-else>
          <BaseButton :to="{ name: 'PatientPharmacy' }" data-testpl="thank-you-continue-shopping">
            {{ $t('continueShopping') }}
          </BaseButton>

          <BaseButton
            :to="{ name: 'PatientOrderHistory' }"
            class="mt-12"
            theme="outline"
            data-testpl="thank-you-track-order"
          >
            {{ $t('trackOrder') }}
          </BaseButton>

          <BaseButton
            :to="{ name: 'PatientHealth' }"
            class="mt-16"
            theme="link"
            data-testpl="thank-you-go-back-to-dashboard"
          >
            {{ $t('goBackToDashboard') }}
          </BaseButton>
        </template>
      </div>
    </div>
  </section>
</template>
