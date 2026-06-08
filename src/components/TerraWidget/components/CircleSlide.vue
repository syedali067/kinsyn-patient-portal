<script setup lang="ts">
import type { TerraWidgetCircleProgressSlideData, TerraWidgetSlideTheme } from '../types';
import ArcProgress from '@/components/ArcProgress/ArcProgress.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  data: TerraWidgetCircleProgressSlideData;
  theme: TerraWidgetSlideTheme;
}>();

const { t } = useI18n();

interface TimeItem {
  label: string;
  value: string;
}

const timeItems = computed<TimeItem[]>(() => {
  const items: TimeItem[] = [];

  if (props.data.rest) {
    items.push({
      label: t('rest'),
      value: props.data.rest,
    });
  }

  if (props.data.low) {
    items.push({
      label: t('low'),
      value: props.data.low,
    });
  }

  if (props.data.medium) {
    items.push({
      label: t('medium'),
      value: props.data.medium,
    });
  }

  if (props.data.high) {
    items.push({
      label: t('high'),
      value: props.data.high,
    });
  }

  return items;
});
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center gap-42 text-white">
    <ArcProgress
      :progress="data.points"
      type="circle"
      :label="data.label"
      :custom-progress="data.pointsToShow"
      :theme="theme === 'brown' ? 'dark' : theme"
    />

    <div class="grid grid-cols-2 gap-x-65 gap-y-24">
      <div v-for="(item, index) in timeItems" :key="`${item.label}-${index}`" class="flex gap-8">
        <div
          class="size-12 rounded-full bg-white"
          :class="`bg-white/${100 - index * (100 / timeItems.length)}`"
        />

        <div class="flex flex-col gap-2">
          <div class="text-14">{{ item.label }}</div>

          <div class="text-21">{{ item.value }}</div>
        </div>
      </div>
    </div>

    <span v-if="data.caption" class="text-center">
      {{ data.caption }}
    </span>
  </div>
</template>
