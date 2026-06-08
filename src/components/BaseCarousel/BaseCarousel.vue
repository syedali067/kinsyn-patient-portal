<script lang="ts" setup>
import type { BaseCarouselColor } from './types';
import { PaginationList, PaginationListItem, PaginationRoot } from 'reka-ui';
import { computed } from 'vue';

const model = defineModel<number>();

const props = withDefaults(
  defineProps<{
    total?: number;
    color?: BaseCarouselColor;
  }>(),
  {
    total: undefined,
    color: 'light',
  },
);

const buttonClasses = {
  light: {
    normal: 'bg-white/25 hover:bg-white',
    active: '!bg-white',
  },
  dark: {
    normal: 'bg-coal/25 hover:bg-coal',
    active: '!bg-coal',
  },
};

const buttonClass = computed(() => (pageValue: number) => {
  return [
    model.value === pageValue
      ? buttonClasses[props.color].active
      : buttonClasses[props.color].normal,
  ];
});
</script>

<template>
  <PaginationRoot :total v-model:page="model" :items-per-page="1" :default-page="1">
    <PaginationList v-slot="{ items }" class="flex items-center justify-center gap-4">
      <template v-for="(page, index) in items">
        <PaginationListItem v-if="page.type === 'page'" :key="index" :value="page.value" as-child>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-full"
            :class="buttonClass(page.value)"
          />
        </PaginationListItem>
      </template>
    </PaginationList>
  </PaginationRoot>
</template>
