<script setup lang="ts">
import type { ContentItem } from '../types';
import ItemCard from './ItemCard.vue';
import ItemCardAccordion from './ItemCardAccordion.vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { AccordionRoot } from 'reka-ui';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
  content: Record<string, ContentItem>;
  stagesCompleted: string[];
  expandedItems: Set<string>;
}>();

const emit = defineEmits<{
  mouseenter: [value: string];
  click: [item: ContentItem];
  toggle: [value: string];
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const accordionValue = ref<string | undefined>(undefined);
</script>

<template>
  <AccordionRoot
    v-if="!greaterOrEqualLg"
    v-model="accordionValue"
    type="single"
    collapsible
    class="flex flex-col gap-8"
  >
    <template v-for="item in content" :key="item.id">
      <ItemCardAccordion
        v-if="item.id !== 'main'"
        :item
        :stages-completed
        :title-key="t(item.id)"
        :value="item.id"
        @click="emit('click', item)"
      />
    </template>
  </AccordionRoot>
  <div v-else class="flex flex-col gap-8">
    <template v-for="item in content" :key="item.id">
      <ItemCard
        v-if="item.id !== 'main'"
        :item
        :stages-completed
        :title-key="t(item.id)"
        @mouseenter="emit('mouseenter', $event)"
        @click="emit('click', item)"
      />
    </template>
  </div>
</template>
