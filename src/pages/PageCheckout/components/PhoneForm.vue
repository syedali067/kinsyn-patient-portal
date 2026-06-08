<script setup lang="ts">
import BaseCheckbox from '@/components/BaseCheckbox/BaseCheckbox.vue';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import { maskPhone } from '@/composables/useMaskOptions';
import { type Validation } from '@vuelidate/core';
import { vMaska } from 'maska/vue';

defineProps<{
  phoneValidation?: Validation;
}>();

const phone = defineModel('phone', { default: '' });

const consent = defineModel('consent', {
  default: {
    consentSmsTransactional: false,
  },
});
</script>

<template>
  <form class="grid gap-16" data-testpl="checkout-phone-form">
    <div>
      <BaseInput
        :model-value="phone.slice(2)"
        v-maska="{
          ...maskPhone,
          onMaska: (detail) => (phone = `+1${detail.unmasked}`),
        }"
        :placeholder="$t('phoneNumber')"
        :error="phoneValidation?.phone.$errors[0]?.$message"
        data-testpl="checkout-phone-input"
      >
        <template #prepend>
          <span>🇺🇸 +1</span>
        </template>
      </BaseInput>
    </div>

    <div>
      <BaseCheckbox
        v-model="consent.consentSmsTransactional"
        data-testpl="checkout-consent-sms-checkbox"
      >
        <span class="text-secondary-text text-12">
          {{ $t('byProvidingYourNumberYouAgreeToReceiveSms') }}
        </span>
      </BaseCheckbox>
    </div>
  </form>
</template>
