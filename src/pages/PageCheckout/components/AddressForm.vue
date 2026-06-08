<script setup lang="ts">
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect/BaseSelect.vue';
import {
  maskPostalCode,
  maskDoubleName,
  maskAddress,
  maskEmail,
} from '@/composables/useMaskOptions';
import { useStates } from '@/composables/useStates';
import { useUserStore } from '@/stores/user';
import type { CartAddress } from '@/types/cart';
import { type Validation } from '@vuelidate/core';
import { vMaska } from 'maska/vue';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

defineProps<{
  validation?: Validation;
}>();

const address = defineModel<CartAddress>({
  default: {
    addressFirstName: '',
    addressLastName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    zip: '',
    state_code: '',
    email: '',
  },
});

const { states } = useStates();
const userStore = useUserStore();
const { isGuest } = storeToRefs(userStore);

const line1InputComponent = ref<typeof BaseInput | null>(null);

defineExpose({
  line1InputComponent,
});
</script>

<template>
  <form class="grid grid-cols-2 gap-16">
    <div class="col-span-full lg:col-span-1">
      <BaseInput
        v-model.trim="address.addressFirstName"
        v-maska="maskDoubleName"
        :placeholder="$t('firstName')"
        :error="validation?.addressFirstName.$errors[0]?.$message"
        data-testpl="checkout-first-name-input"
      />
    </div>

    <div class="col-span-full lg:col-span-1">
      <BaseInput
        v-model.trim="address.addressLastName"
        v-maska="maskDoubleName"
        :placeholder="$t('lastName')"
        :error="validation?.addressLastName.$errors[0]?.$message"
        data-testpl="checkout-last-name-input"
      />
    </div>

    <div class="col-span-full">
      <BaseInput
        ref="line1InputComponent"
        v-model.trim="address.line1"
        v-maska="maskAddress"
        :placeholder="$t('streetAndHouseNumber')"
        :error="validation?.line1.$errors[0]?.$message"
        data-testpl="checkout-line1-input"
      />
    </div>

    <div class="col-span-full">
      <BaseInput
        v-model.trim="address.line2"
        v-maska="maskAddress"
        :placeholder="`${$t('apartmentUnitSuiteOrFloor')} (${$t('optional').toLowerCase()})`"
        data-testpl="checkout-line2-input"
      />
    </div>

    <div class="col-span-full">
      <BaseSelect
        v-model.trim="address.state_code"
        :placeholder="$t('state')"
        :options="states"
        by="code"
        :error="validation?.state_code.$errors[0]?.$message"
        data-testpl="checkout-state-select"
      />
    </div>

    <div class="col-span-full lg:col-span-1">
      <BaseInput
        v-model.trim="address.zip"
        v-maska="maskPostalCode"
        :placeholder="$t('postalCode')"
        :error="validation?.zip.$errors[0]?.$message"
        data-testpl="checkout-zip-input"
      />
    </div>

    <div class="col-span-full lg:col-span-1">
      <BaseInput
        v-model.trim="address.city"
        v-maska="maskAddress"
        :placeholder="$t('city')"
        :error="validation?.city.$errors[0]?.$message"
        data-testpl="checkout-city-input"
      />
    </div>

    <div class="col-span-full">
      <BaseInput
        v-model="address.email"
        v-maska="maskEmail"
        :placeholder="$t('email')"
        type="email"
        :disabled="!isGuest"
        :error="validation?.email.$errors[0]?.$message"
        data-testpl="checkout-email-input"
      />
    </div>
  </form>
</template>
