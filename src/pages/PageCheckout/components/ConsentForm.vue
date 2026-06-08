<script setup lang="ts">
import { useConsentForm } from '../composables/useConsentForm';
import BaseCheckbox from '@/components/BaseCheckbox/BaseCheckbox.vue';

const { agreeToAuthorizeForm, marketingForm } = useConsentForm();
</script>

<template>
  <form class="flex flex-col gap-16" data-testpl="checkout-consent-form">
    <BaseCheckbox
      v-model="marketingForm.consentEmailGeneralMarketing"
      data-testpl="checkout-consent-email-checkbox"
    >
      <span class="text-secondary-text text-12">
        {{ $t('iLikeToReceiveTipsOffersAndResourcesByEmail') }}
      </span>
    </BaseCheckbox>

    <BaseCheckbox
      v-model="marketingForm.consentSmsMarketing"
      data-testpl="checkout-consent-sms-checkbox"
    >
      <span class="text-secondary-text text-12">
        {{ $t('youAgreeToReceiveRecurringMarketingSms') }}
        <a class="underline" href="/privacy-policy" target="_blank">{{ $t('privacyPolicy') }}</a>
      </span>
    </BaseCheckbox>

    <BaseCheckbox
      v-model="agreeToAuthorizeForm.agreeToAuthorize"
      data-testpl="checkout-consent-authorize-checkbox"
    >
      <span class="text-secondary-text text-12">
        {{ $t('iAuthorizeKinsynToUseMyPersonalHealthInformation') }}
      </span>
    </BaseCheckbox>
  </form>
</template>
