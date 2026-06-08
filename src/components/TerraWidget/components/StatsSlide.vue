<script setup lang="ts">
import type { TerraWidgetSlideTheme, TerraWidgetStatSlideData } from '../types';
import StatItem from './StatItem.vue';

defineProps<{
  data: TerraWidgetStatSlideData;
  theme: TerraWidgetSlideTheme;
}>();
</script>

<template>
  <div
    class="flex h-full flex-col items-center justify-center"
    :class="theme === 'dark' ? 'text-white' : 'text-black'"
  >
    <div v-if="data.stats.length > 0" class="flex w-full flex-col gap-24">
      <StatItem
        v-for="statItem in data.stats"
        :key="statItem.label"
        :data="statItem"
        :theme="theme"
      />
    </div>
  </div>
</template>
