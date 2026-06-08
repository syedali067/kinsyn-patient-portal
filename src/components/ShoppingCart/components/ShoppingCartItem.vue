<script setup lang="ts">
import BaseTicker from '@/components/BaseTicker/BaseTicker.vue';
import ProductImage from '@/components/ProductImage/ProductImage.vue';
import type { ProductImageSize } from '@/components/ProductImage/types';
import { REQUEST_DEBOUNCE_FREQUENCY } from '@/constants/delays';
import { useCartStore } from '@/stores/cart';
import type { CartItem } from '@/types/cart';
import { formatPrice } from '@/utils/formatters';
import { debounce } from 'lodash-es';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { ref } from 'vue';

const props = defineProps<{
  item: CartItem;
  imageSize?: ProductImageSize;
  isCategoryShowed?: boolean;
  dataTestpls?: {
    image?: string;
    quizCategoryTitle?: string;
    title?: string;
    price?: string;
    quantity?: string;
    variantTitle?: string;
    ticker?: string;
    tickerDelete?: string;
    tickerDecrement?: string;
    tickerIncrement?: string;
    tickerInput?: string;
  };
}>();

const product = computed(() => props.item.product);

const cartStore = useCartStore();
const { updateCartLoading } = storeToRefs(cartStore);
const { updateItem } = cartStore;

const quantity = ref(props.item.quantity);

const debouncedUpdateItem = debounce(updateItem, REQUEST_DEBOUNCE_FREQUENCY);

const onUpdateItem = async () => {
  if (!product.value?.id || !props.item.variant?.id) return;

  await debouncedUpdateItem(
    props.item.id,
    product.value?.id,
    quantity.value,
    props.item.variant?.id,
  );
};
</script>

<template>
  <div class="flex gap-16 py-24">
    <ProductImage
      class="shrink-0"
      :image="product?.image?.url || ''"
      :is-rx="product?.rxOnly"
      :gender="product?.gender"
      :size="imageSize"
      :data-testpl="dataTestpls?.image"
      :href="product?.url"
    />

    <div class="flex grow flex-col gap-8">
      <span
        v-if="isCategoryShowed"
        class="text-10 text-beige font-medium uppercase"
        :data-testpl="dataTestpls?.quizCategoryTitle"
      >
        {{ product?.quizCategory.title }}
      </span>

      <div class="flex gap-16">
        <span class="grow" :title="item.variant?.variantType" :data-testpl="dataTestpls?.title">
          {{ product?.title }}
        </span>

        <span :data-testpl="dataTestpls?.price">
          {{ formatPrice(item.subtotal) }}
        </span>
      </div>

      <span class="text-14 text-secondary-text" :data-testpl="dataTestpls?.variantTitle">
        {{ item.variant?.title }}
      </span>

      <BaseTicker
        v-model="quantity"
        class="self-end"
        :loading="updateCartLoading"
        :max="item.variant?.variantMaxPurchaseQuantity || undefined"
        :data-testpl="dataTestpls?.ticker"
        :data-testpls="{
          delete: dataTestpls?.tickerDelete,
          decrement: dataTestpls?.tickerDecrement,
          increment: dataTestpls?.tickerIncrement,
          input: dataTestpls?.tickerInput,
        }"
        @update:model-value="onUpdateItem"
      />
    </div>
  </div>
</template>
