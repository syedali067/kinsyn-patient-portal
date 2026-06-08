<script setup lang="ts">
import type { ContentItem } from '../types';
import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import IconCheckCircle from '@/assets/icons/check-circle.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';

defineProps<{
  item: ContentItem;
  stagesCompleted: string[];
  titleKey?: string;
}>();

const emit = defineEmits<{
  click: [value: string];
  mouseenter: [value: string];
}>();
</script>

<template>
  <div
    class="rounded-4 flex w-full cursor-default flex-row items-center justify-between gap-16 px-16 py-24 transition-all hover:shadow-sm lg:flex-col lg:items-start lg:gap-8 lg:px-24"
    :class="[
      stagesCompleted.includes(item.id) ? 'bg-beige text-white' : 'bg-site-bg',
      {
        'pointer-events-none cursor-progress opacity-50': item.loading,
      },
    ]"
    @mouseenter="emit('mouseenter', stagesCompleted.includes(item.id) ? 'main' : item.id)"
  >
    <div class="flex w-full items-center justify-between gap-16">
      <div class="flex items-center gap-16">
        <component :is="item.icon" class="size-32 shrink-0" />

        <p v-if="titleKey">
          {{ titleKey }}
        </p>
      </div>

      <div class="flex items-center gap-8">
        <BaseButton
          v-if="!stagesCompleted.includes(item.id)"
          rounded
          color="gray"
          size="32"
          class="shrink-0"
          @click="emit('click', item.id)"
        >
          <template #prepend>
            <IconArrowRight class="size-20" />
          </template>
        </BaseButton>

        <div v-if="stagesCompleted.includes(item.id)" class="flex h-28 items-center gap-4 lg:gap-8">
          <IconCheckCircle class="size-20" />
          <span class="text-10 uppercase">{{ item.completeText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
