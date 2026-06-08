<script setup lang="ts">
import type { DrawerInstructionsForUseSubscription } from '../types';
import IconRx from '@/assets/icons/rx.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { useSubscriptionItem } from '@/composables/useSubscriptionItem';
import type { ModifiedSubscriptionItem } from '@/types/subscription';

const props = defineProps<{
  subscription: ModifiedSubscriptionItem;
}>();

const emit = defineEmits<{
  openInstructions: [value: DrawerInstructionsForUseSubscription];
}>();

const {
  planStatus,
  imageUrl,
  imageAlt,
  isRxOnly,
  categoryName,
  itemType,
  itemTitle,
  formattedPriceWithPeriod,
  formattedDosage,
  quantity,
} = useSubscriptionItem(props.subscription);

const onOpenInstructions = () => {
  if (props.subscription.productId) {
    emit('openInstructions', {
      productId: props.subscription.productId,
      imageUrl: imageUrl.value,
      imageAlt: imageAlt.value,
      isRxOnly: isRxOnly.value,
      categoryName: categoryName.value,
      itemType: itemType.value,
      itemTitle: itemTitle.value,
      formattedPriceWithPeriod: formattedPriceWithPeriod.value,
      formattedDosage: formattedDosage.value,
      quantity: quantity.value,
    });
  }
};
</script>

<template>
  <li
    class="rounded-4 flex flex-col items-center gap-24 p-16 lg:flex-row lg:gap-32 lg:p-24"
    :class="planStatus === 'pending' ? 'bg-white/50' : 'bg-white'"
    :id="subscription.id.toString()"
    data-testpl="subscription-item"
  >
    <div class="flex w-full gap-16" data-testpl="subscription-item-block">
      <figure
        v-if="imageUrl"
        class="rounded-4 bg-sand/20 relative h-110 w-81 overflow-hidden p-16"
        data-testpl="subscription-item-figure"
      >
        <img
          :src="imageUrl"
          :alt="imageAlt"
          class="h-full w-full object-contain"
          data-testpl="subscription-item-img"
        />

        <IconRx
          v-if="isRxOnly"
          class="absolute top-8 left-8 size-20"
          data-testpl="subscription-item-rx-icon"
        />
      </figure>

      <div class="flex flex-col" data-testpl="subscription-item-info">
        <span
          v-if="categoryName"
          class="text-10 text-beige font-medium uppercase"
          data-testpl="subscription-item-category"
        >
          {{ categoryName }}
        </span>

        <span
          v-if="subscription.variant"
          class="text-secondary-text text-10 mt-4"
          data-testpl="subscription-item-type"
        >
          {{ $t(itemType) }}
        </span>

        <h2 class="mt-8" data-testpl="subscription-item-title">
          {{ itemTitle }}
        </h2>

        <span
          v-if="formattedPriceWithPeriod"
          class="mt-12 lowercase"
          data-testpl="subscription-item-price"
        >
          {{ formattedPriceWithPeriod }}
        </span>

        <p
          v-if="formattedDosage"
          class="text-12 lg:text-14 mt-8 flex items-center gap-4"
          data-testpl="subscription-item-dosage"
        >
          <span class="text-secondary-text"> {{ $t('dosage') }}: </span>

          <span data-testpl="subscription-item-dosage-value">
            {{ formattedDosage }}
          </span>
        </p>

        <p v-if="quantity" class="text-12 lg:text-14 mt-4" data-testpl="subscription-item-quantity">
          <span class="text-secondary-text"> {{ $t('quantity') }}: </span>

          <span data-testpl="subscription-item-quantity-value">
            {{ quantity }}
          </span>
        </p>
      </div>
    </div>

    <BaseButton
      class="w-full shrink-0 lg:w-fit"
      data-testpl="subscription-item-instructions-btn"
      @click="onOpenInstructions"
    >
      {{ $t('instructionsForUse') }}
    </BaseButton>
  </li>
</template>
