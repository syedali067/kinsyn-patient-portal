<script setup lang="ts">
import IconDots from '@/assets/icons/dots.svg?component';
import BasePopover from '@/components/BasePopover/BasePopover.vue';
import { useStaticData } from '@/composables/useStaticData';
import type { PaymentMethod } from '@/types/payment.ts';
import { format, isAfter, parseISO } from 'date-fns';
import { useI18n } from 'vue-i18n';

defineProps<{
  method: PaymentMethod;
}>();

const emit = defineEmits<{
  delete: [];
  setDefault: [];
}>();

const { t } = useI18n();
const { paymentMap } = useStaticData();

const isExpired = (expirationDate: string) => {
  return isAfter(new Date(), parseISO(expirationDate));
};
</script>

<template>
  <div class="flex items-center gap-8">
    <div class="flex grow flex-col gap-8">
      <p class="text-beige text-10 font-medium uppercase">
        {{ paymentMap[method.card.type].label }}
        <span v-if="method.card.default">({{ $t('default') }})</span>
      </p>

      <div class="flex items-center gap-32">
        <span class="text-14">•••• •••• •••• {{ method.card.ending }}</span>
        <span v-if="!isExpired(method.card.expirationDate)" class="text-12 text-secondary-text">
          {{ $t('expiration') }}: {{ format(method.card.expirationDate, 'MM/yy') }}
        </span>
        <span v-else class="text-12 text-error"> {{ t('expired') }} </span>
      </div>
    </div>

    <BasePopover align="end">
      <template #trigger>
        <button type="button">
          <IconDots class="size-24 rotate-90" />
        </button>
      </template>

      <template #content="{ close }">
        <div class="flex flex-col gap-16 p-12">
          <button
            type="button"
            class="hover:bg-bone/50 hover:rounded-4 text-14 p-8 text-left"
            @click="
              emit('setDefault');
              close();
            "
          >
            {{ $t('setAsDefault') }}
          </button>

          <button
            type="button"
            class="hover:bg-bone/50 hover:rounded-4 text-14 p-8 text-left"
            @click="
              emit('delete');
              close();
            "
          >
            {{ $t('remove') }}
          </button>
        </div>
      </template>
    </BasePopover>
  </div>
</template>
