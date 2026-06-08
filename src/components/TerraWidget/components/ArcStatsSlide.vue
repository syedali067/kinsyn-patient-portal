<script setup lang="ts">
import type { TerraWidgetArcStatsSlideData, TerraWidgetSlideTheme } from '../types';
import StatItem from './StatItem.vue';
import ArcProgress from '@/components/ArcProgress/ArcProgress.vue';

defineProps<{
  data: TerraWidgetArcStatsSlideData;
  theme: TerraWidgetSlideTheme;
}>();
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center text-white">
    <ArcProgress :progress="data.points" :theme="theme === 'brown' ? 'dark' : theme" />

    <span v-if="data.title" class="text-18 mb-8 font-medium">{{ data.title }}</span>

    <span v-if="data.caption" class="text-12 not-last:mb-32">{{ data.caption }}</span>

    <div v-if="data.stats.length > 0" class="flex w-full flex-col gap-24">
      <template v-for="stat in data.stats" :key="stat.label">
        <StatItem v-if="stat.value" :data="stat" :theme="theme" />
      </template>
    </div>
  </div>
</template>
