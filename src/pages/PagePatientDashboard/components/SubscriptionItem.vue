<script setup lang="ts">
import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import IconTime from '@/assets/icons/time.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { useSubscriptionItem } from '@/composables/useSubscriptionItem';
import type { ModifiedSubscriptionItem } from '@/types/subscription';

const props = defineProps<{
  subscription: ModifiedSubscriptionItem;
}>();

const { planStatus, categoryName, itemTitle } = useSubscriptionItem(props.subscription);
</script>

<template>
  <div class="flex w-full items-center justify-between gap-12" data-testpl="subscription-item">
    <div class="flex flex-col gap-6">
      <p class="text-10 text-beige font-medium uppercase">
        {{ categoryName }}
      </p>
      <p class="text-21" :class="{ 'text-disabled-text': planStatus === 'pending' }">
        {{ itemTitle }}
      </p>
    </div>

    <BaseButton
      v-if="planStatus === 'pending'"
      :to="{ name: 'PatientTreatments', hash: `#${subscription.id}` }"
      size="32"
      rounded
      color="gray"
      data-testpl="subscription-item-link"
    >
      <template #append>
        <IconTime class="size-20 shrink-0" />
      </template>
    </BaseButton>

    <BaseButton
      v-else
      :to="{ name: 'PatientTreatments', hash: `#${subscription.id}` }"
      size="32"
      rounded
      color="gray"
      data-testpl="subscription-item-link"
    >
      <template #append>
        <IconArrowRight class="size-20 shrink-0" />
      </template>
    </BaseButton>
  </div>
</template>
