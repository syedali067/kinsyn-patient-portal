<script setup lang="ts">
import { useChargebee } from '@/composables/useChargebee.ts';
import {
  CardComponent,
  CardNumber,
  CardExpiry,
  CardCvv,
} from '@chargebee/chargebee-js-vue-wrapper';

defineProps<{
  isLoading?: boolean;
}>();

const { cardComponent, cardErrors, onCardChange, cardSettings } = useChargebee();
</script>

<template>
  <div>
    <CardComponent
      ref="cardComponent"
      class="flex flex-wrap gap-16"
      v-bind="cardSettings"
      @change="onCardChange"
    >
      <div class="w-full">
        <CardNumber
          class="input"
          :placeholder="$t('cardNumber')"
          :class="{ 'pointer-events-none opacity-50': isLoading }"
        />
        <p v-if="cardErrors.number" class="text-error text-12 mt-8">
          {{ cardErrors.number.message }}
        </p>
      </div>
      <div class="grow">
        <CardExpiry
          class="input"
          :placeholder="$t('expiryDate')"
          :class="{ 'pointer-events-none opacity-50': isLoading }"
        />
        <p v-if="cardErrors.expiry" class="text-error text-12 mt-8">
          {{ cardErrors.expiry.message }}
        </p>
      </div>
      <div class="grow">
        <CardCvv
          class="input"
          :placeholder="$t('cvv')"
          :class="{ 'pointer-events-none opacity-50': isLoading }"
        />
        <p v-if="cardErrors.cvv" class="text-error text-12 mt-8">
          {{ cardErrors.cvv.message }}
        </p>
      </div>
    </CardComponent>
  </div>
</template>

<style scoped>
@reference '@/assets/css/main.css';

.input {
  @apply rounded-4 border-ash flex h-48 items-center border px-16 -outline-offset-1;

  &.focus {
    @apply outline-beige outline-2;
  }
  &.invalid {
    @apply outline-error outline-2;
  }
}
</style>
