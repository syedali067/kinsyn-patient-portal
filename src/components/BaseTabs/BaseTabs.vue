<script setup lang="ts">
import type { BaseTab, BaseTabTheme } from './types';
import { TabsList, TabsRoot, TabsTrigger } from 'reka-ui';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    tabs: BaseTab[];
    defaultValue?: BaseTab['id'];
    theme?: BaseTabTheme;
  }>(),
  {
    tabs: () => [],
    theme: 'underline',
  },
);

const defaultValue = computed(() => props.defaultValue || props.tabs[0]?.id);

const rowAppearanceClass = computed(() => ({
  'gap-4': props.theme === 'tab',
  'gap-24':
    props.theme === 'text' || props.theme === 'underline' || props.theme === 'underline-text',
}));

const tabAppearanceClass = computed(() => ({
  'text-14 bg-white/50 data-[state=active]:bg-white px-24 py-12 rounded-t-4 font-medium shrink-0':
    props.theme === 'tab',
  'text-21 lg:text-26': props.theme === 'text',
  'text-21 lg:text-26 data-[state=active]:border-b-1': props.theme === 'underline-text',
  'text-12 font-medium uppercase data-[state=active]:underline': props.theme === 'underline',
}));
</script>

<template>
  <TabsRoot :default-value>
    <TabsList class="flex" :class="rowAppearanceClass" data-testpl="base-tabs-list">
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.id"
        :value="tab.id"
        :disabled="tab.disabled"
        class="text-disabled-text data-[state=active]:text-coal transition-colors"
        :class="[
          tabAppearanceClass,
          {
            'hover:text-secondary-text': !tab.disabled,
          },
        ]"
        data-testpl="base-tabs-trigger"
      >
        {{ tab.label }}
      </TabsTrigger>
    </TabsList>
  </TabsRoot>
</template>
