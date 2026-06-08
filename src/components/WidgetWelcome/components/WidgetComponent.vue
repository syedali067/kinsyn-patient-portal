<script setup lang="ts">
import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import IconCheckCircle from '@/assets/icons/check-circle.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
import { computed } from 'vue';

const props = defineProps<{
  messageCount: number | undefined;
  cartItemsCount: number | undefined;
  greetingText: string;
  firstName?: string | null;
}>();

const totalQuantity = computed(() => {
  return Number(props.messageCount) + Number(props.cartItemsCount);
});
</script>

<template>
  <div
    class="rounded-8 flex flex-col bg-white p-16 lg:h-367 lg:p-24"
    :class="{ 'gap-24 lg:gap-32': totalQuantity, 'gap-16 lg:gap-0': !totalQuantity }"
    data-testpl="dashboard-account"
  >
    <div class="flex flex-col gap-12 lg:gap-16">
      <h2 class="text-21 lg:text-26 font-secondary" data-testpl="card-header">
        <template v-if="!totalQuantity">
          {{ greetingText }}<span v-if="firstName">, {{ firstName }} </span>.
        </template>
        <template v-else>{{ $t('whatsNew') }}</template>
      </h2>
      <p v-if="totalQuantity" class="text-14 text-secondary-text">
        {{ totalQuantity }} {{ $t('itemsNeedYourAttention', totalQuantity) }}
      </p>
    </div>

    <div v-if="totalQuantity" class="text-14 flex flex-col gap-16">
      <div class="flex items-center justify-between gap-8">
        <p v-if="messageCount">
          <span class="font-bold"> {{ messageCount }} {{ $t('newMessage', messageCount) }} </span>
          {{ $t('fromYourClinician') }}
        </p>
        <p v-else class="font-bold">{{ $t('noNewMessages') }}</p>

        <BaseButton
          :to="{ name: 'PatientMessages' }"
          size="32"
          color="gray"
          rounded
          data-testpl="card-button"
        >
          <template #prepend>
            <IconArrowRight class="size-20 shrink-0" />
          </template>
        </BaseButton>
      </div>

      <BaseSeparator v-if="cartItemsCount" class="bg-bone" />

      <div v-if="cartItemsCount" class="flex items-center justify-between gap-8">
        <p>
          <span class="font-bold"> {{ cartItemsCount }} {{ $t('item', cartItemsCount) }} </span>
          {{ $t('inYourShoppingCart') }}
        </p>

        <BaseButton :to="{ name: 'Cart' }" size="32" color="gray" rounded data-testpl="card-button">
          <template #prepend>
            <IconArrowRight class="size-20 shrink-0" />
          </template>
        </BaseButton>
      </div>
    </div>

    <div v-else class="mt-16 flex h-full flex-col items-center justify-center gap-16">
      <IconCheckCircle class="size-32" />
      <p class="text-14">{{ $t('goodJobYouAreAllCaughtUp') }}</p>
    </div>
  </div>
</template>
