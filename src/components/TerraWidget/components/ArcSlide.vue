<script setup lang="ts">
import type { TerraWidgetArcProgressSlideData, TerraWidgetSlideTheme } from '../types';
import ArcProgress from '@/components/ArcProgress/ArcProgress.vue';

defineProps<{
  data: TerraWidgetArcProgressSlideData;
  theme: TerraWidgetSlideTheme;
}>();
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center gap-16 text-white">
    <ArcProgress :progress="data.points" :theme="theme === 'brown' ? 'dark' : theme" />

    <span v-if="data.level" class="text-18 font-medium not-last:mb-32">{{ data.level }}</span>

    <span v-if="data.title" class="text-18 font-medium">{{ data.title }}</span>

    <span v-if="data.caption">{{ data.caption }}</span>
  </div>
</template>
