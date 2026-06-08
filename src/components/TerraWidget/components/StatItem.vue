<script setup lang="ts">
import type { TerraWidgetSlideTheme, TerraWidgetStatItem } from '../types';

defineProps<{
  data: TerraWidgetStatItem;
  theme: TerraWidgetSlideTheme;
}>();
</script>

<template>
  <div class="flex gap-12" :class="theme === 'dark' ? 'text-white' : 'text-black'">
    <div
      class="rounded-4 grid size-64 shrink-0 place-items-center"
      :class="theme === 'dark' ? 'bg-coal/50' : 'bg-bone'"
    >
      <component :is="data.icon" class="size-32" />
    </div>

    <div class="-mt-2 flex flex-col">
      <span class="mb-2">
        {{ data.label }}
      </span>

      <span>
        <span class="text-48 font-secondary">
          {{ data.value }}
        </span>

        <span v-if="data.valueSub"> &nbsp;{{ data.valueSub }} </span>
      </span>
    </div>

    <span v-if="data.additionalValue" class="text-18 mb-2 ml-auto self-end text-right">
      {{ data.additionalValue }}
    </span>
  </div>
</template>
