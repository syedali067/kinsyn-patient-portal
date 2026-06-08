<script setup lang="ts">
import AccountDetailsBlock from './components/AccountDetailsBlock.vue';
import AddressBlock from './components/AddressBlock.vue';
import CommunicationPreferenceBlock from './components/CommunicationPreferenceBlock.vue';
import IdentificationBlock from './components/IdentificationBlock.vue';
import MammothIdBlock from './components/MammothIdBlock.vue';
import PasswordBlock from './components/PasswordBlock.vue';
import PaymentDetailsBlock from './components/PaymentDetailsBlock.vue';
// import TOTPBlock from './components/TOTPBlock.vue'; // TODO: uncomment after first launch, this block is hidden for now
import { useAddress } from './composables/useAddress.ts';
import { usePostHog } from '@/composables/usePostHog.ts';
import AICompanion from '@/pages/PagePatientAccount/components/AICompanion.vue';
import { useUserStore } from '@/stores/user';
import { waitTransition } from '@/utils/pageTransition.ts';
import { ref } from 'vue';

const userStore = useUserStore();
await userStore.getProfile(false);

const { addressBlockComponent } = useAddress();

await waitTransition();

const isAISettingsEnabled = ref(false);

const { posthog } = usePostHog();

posthog.onFeatureFlags(() => {
  isAISettingsEnabled.value = posthog.isFeatureEnabled('patient-portal-ai-settings') ?? false;
});
</script>

<template>
  <div class="row" data-page-in="fadeInUp" data-page-out="fadeOutUp">
    <div class="col-span-full flex flex-col gap-24 lg:col-span-6 lg:col-start-4">
      <h1 class="text-21 lg:text-26 font-secondary">{{ $t('account') }}</h1>

      <AccountDetailsBlock />

      <PaymentDetailsBlock />

      <AddressBlock ref="addressBlockComponent" />

      <IdentificationBlock />

      <PasswordBlock />

      <AICompanion v-if="isAISettingsEnabled" />

      <CommunicationPreferenceBlock />

      <!-- TODO: uncomment after first launch, this block is hidden for now -->
      <!-- <TOTPBlock /> -->

      <MammothIdBlock />
    </div>
  </div>
</template>
