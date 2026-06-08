<script setup lang="ts">
import type { DrawerInstructionsForUseSubscription } from '../types';
import IconRx from '@/assets/icons/rx.svg?component';
/* import BaseButton from '@/components/BaseButton/BaseButton.vue'; */
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import SafeText from '@/components/SafeText/SafeText.vue';
import type { PharmacyProduct } from '@/types/pharmacy';
import { computed } from 'vue';

const model = defineModel<boolean>();

const props = defineProps<{
  subscription?: DrawerInstructionsForUseSubscription;
  product?: PharmacyProduct;
}>();

const productOverviews = computed(() => {
  return props.product?.productOverview?.filter((item) => item.type === 'productOverview');
});
</script>

<template>
  <BaseDialog
    v-model:open="model"
    position="right"
    class="max-w-424"
    data-testpl="drawer-instructions"
  >
    <template #header>
      {{ $t('instructionsForUse') }}
    </template>

    <template v-if="subscription" #content>
      <div class="flex w-full gap-16" data-testpl="drawer-instructions-product">
        <figure
          v-if="subscription.imageUrl"
          class="rounded-4 bg-sand/20 relative h-110 w-81 overflow-hidden p-16"
          data-testpl="drawer-instructions-product-figure"
        >
          <img
            :src="subscription.imageUrl"
            :alt="subscription.imageAlt"
            class="h-full w-full object-contain"
            data-testpl="drawer-instructions-product-img"
          />

          <IconRx
            v-if="subscription.isRxOnly"
            class="absolute top-8 left-8 size-20"
            data-testpl="drawer-instructions-product-rx-icon"
          />
        </figure>

        <div class="flex flex-col" data-testpl="drawer-instructions-product-info">
          <span
            v-if="subscription.categoryName"
            class="text-10 text-beige font-medium uppercase"
            data-testpl="drawer-instructions-product-category-name"
          >
            {{ subscription.categoryName }}
          </span>

          <span
            v-if="subscription.itemType"
            class="text-secondary-text text-10 mt-4"
            data-testpl="drawer-instructions-product-type"
          >
            {{ $t(subscription.itemType) }}
          </span>

          <h2 class="mt-8" data-testpl="drawer-instructions-product-title">
            {{ subscription.itemTitle }}
          </h2>

          <span
            v-if="subscription.formattedPriceWithPeriod"
            class="mt-8 lowercase"
            data-testpl="subscription-item-price"
          >
            {{ subscription.formattedPriceWithPeriod }}
          </span>

          <p
            v-if="subscription.formattedDosage"
            class="text-12 lg:text-14 mt-8 flex items-center gap-4"
            data-testpl="drawer-instructions-product-dosage"
          >
            <span class="text-secondary-text"> {{ $t('dosage') }}: </span>

            <span data-testpl="drawer-instructions-product-dosage-value">
              {{ subscription.formattedDosage }}
            </span>
          </p>

          <p
            v-if="subscription.quantity"
            class="text-12 lg:text-14 mt-4"
            data-testpl="drawer-instructions-product-quantity"
          >
            <span class="text-secondary-text"> {{ $t('quantity') }}: </span>

            <span data-testpl="drawer-instructions-product-quantity-value">
              {{ subscription.quantity }}
            </span>
          </p>
        </div>
      </div>

      <!-- turn it off for now -->
      <!--  border-b -->
      <ul
        class="border-bone mt-12 flex flex-col"
        data-testpl="drawer-instructions-product-overviews-list"
      >
        <li
          class="mt-12 flex flex-col gap-12"
          v-for="faq in productOverviews"
          :key="faq.id"
          data-testpl="drawer-instructions-product-overviews-list-item"
        >
          <span
            class="text-26 font-secondary"
            data-testpl="drawer-instructions-product-overviews-list-item-heading"
          >
            {{ faq.fields.heading }}
          </span>

          <SafeText
            tag="div"
            :text="faq.fields.simpleText"
            class="text-14 prose"
            data-testpl="drawer-instructions-product-overviews-list-item-text"
          />
        </li>
      </ul>

      <!-- turn it off for now -->
      <!-- <p class="mt-16 text-center">
        {{ $t('stillInDoubtContactOurKINSYNCareTeam') }}
      </p> -->

      <!-- <BaseButton theme="outline" class="mt-16 w-full"> {{ $t('requestASession') }} </BaseButton> -->
    </template>
  </BaseDialog>
</template>
