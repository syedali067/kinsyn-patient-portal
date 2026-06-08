<script setup lang="ts">
import IconCheck from '@/assets/icons/check.svg?component';
import IconClose from '@/assets/icons/close.svg?component';
import IconRx from '@/assets/icons/rx.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { useSubscriptionItem } from '@/composables/useSubscriptionItem';
import type { ModifiedSubscriptionItem } from '@/types/subscription';
import { computed } from 'vue';

const props = defineProps<{
  subscription: ModifiedSubscriptionItem;
  subscriptionIdsToRemove: number[];
}>();

const emit = defineEmits<{
  remove: [value: number];
  add: [value: number];
}>();

const {
  imageUrl,
  imageAlt,
  isRxOnly,
  categoryName,
  itemType,
  itemTitle,
  formattedPriceWithDiscount,
  formattedPriceWithPeriod,
  formattedDosage,
  quantity,
} = useSubscriptionItem(props.subscription);

const itemToRemove = computed(() =>
  props.subscriptionIdsToRemove.find((i) => i === props.subscription.id),
);
</script>

<template>
  <li
    class="flex w-full gap-16"
    :id="subscription.id.toString()"
    data-testpl="reactivate-subscription-item"
  >
    <figure
      class="rounded-4 relative h-110 w-81 min-w-81 overflow-hidden p-16 transition-colors"
      :class="itemToRemove ? 'bg-disabled-bg/50' : 'bg-sand/20'"
    >
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="imageAlt"
        class="h-full w-full object-contain transition-opacity"
        :class="{
          'opacity-50': itemToRemove,
        }"
        data-testpl="reactivate-subscription-item-img"
      />
      <IconRx
        v-if="isRxOnly"
        class="absolute top-8 left-8 size-20 transition-colors"
        :class="{
          'text-disabled-text': itemToRemove,
        }"
        data-testpl="reactivate-subscription-item-rx-icon"
      />
    </figure>

    <div class="flex flex-col">
      <span
        v-if="categoryName"
        class="text-10 text-beige font-medium uppercase transition-colors"
        :class="{
          'text-disabled-text': itemToRemove,
        }"
        data-testpl="reactivate-subscription-item-category-name"
      >
        {{ categoryName }}
      </span>

      <span
        v-if="subscription.variant"
        class="text-10 mt-4 transition-colors"
        :class="itemToRemove ? 'text-disabled-text' : 'text-secondary-text'"
        data-testpl="reactivate-subscription-item-type"
      >
        {{ $t(itemType) }}
      </span>

      <h2
        class="mt-8 transition-colors"
        :class="{
          'text-disabled-text line-through': itemToRemove,
        }"
        data-testpl="reactivate-subscription-item-title"
      >
        {{ itemTitle }}
      </h2>

      <p class="text-14 mt-4 lowercase">
        <span
          v-if="formattedPriceWithPeriod"
          :class="{
            'text-disabled-text line-through': itemToRemove,
            'text-secondary-text line-through': formattedPriceWithDiscount,
          }"
          data-testpl="reactivate-subscription-item-price"
        >
          {{ formattedPriceWithPeriod }}
        </span>
        <span v-if="formattedPriceWithDiscount"> &nbsp;{{ formattedPriceWithDiscount }} </span>
      </p>

      <p
        v-if="formattedDosage"
        class="text-12 lg:text-14 mt-8 flex items-center gap-4"
        data-testpl="reactivate-subscription-item-dosage"
      >
        <span class="text-secondary-text"> {{ $t('dosage') }}: </span>

        <span data-testpl="reactivate-subscription-item-dosage-value">
          {{ formattedDosage }}
        </span>
      </p>

      <p
        v-if="quantity"
        class="text-12 lg:text-14 mt-4"
        data-testpl="reactivate-subscription-item-quantity"
      >
        <span class="text-secondary-text"> {{ $t('quantity') }}: </span>

        <span data-testpl="reactivate-subscription-item-quantity-value">
          {{ quantity }}
        </span>
      </p>
    </div>

    <template v-if="itemType === 'addon'">
      <Transition
        mode="out-in"
        enter-active-class="animate-[zoomIn_0.3s]"
        leave-active-class="animate-[zoomOut_0.3s]"
      >
        <BaseButton
          v-if="!itemToRemove"
          size="32"
          rounded
          color="light"
          class="ml-auto shrink-0"
          key="cancel"
          data-testpl="reactivate-subscription-item-remove-btn"
          @click="emit('remove', subscription.id)"
        >
          <template #prepend>
            <IconClose class="size-20" />
          </template>
        </BaseButton>

        <BaseButton
          v-else
          size="32"
          rounded
          color="light"
          class="ml-auto shrink-0"
          key="confirm"
          data-testpl="reactivate-subscription-item-add-btn"
          @click="emit('add', subscription.id)"
        >
          <template #prepend>
            <IconCheck class="size-20" />
          </template>
        </BaseButton>
      </Transition>
    </template>
  </li>
</template>
