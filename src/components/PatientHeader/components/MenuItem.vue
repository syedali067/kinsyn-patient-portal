<script setup lang="ts">
import BaseCounter from '@/components/BaseCounter/BaseCounter.vue';
import type { NavigationItem } from '@/types/navigation.ts';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps<{
  item: NavigationItem;
}>();

const emits = defineEmits<{
  click: [item: NavigationItem];
}>();

const rootComponent = computed(() => {
  if (props.item.action) {
    return 'button';
  } else if (props.item.to) {
    return RouterLink;
  }

  return 'div';
});

const onActionClick = () => {
  if (props.item.action) {
    props.item.action();
  }

  emits('click', props.item);
};
</script>

<template>
  <component
    :is="rootComponent"
    :to="item.to"
    class="group menu-item relative block size-40 p-8"
    :data-onboarding-step="item.id === 'messages' ? 'messages' : undefined"
    data-testpl="patient-header-navigation-list-item-link"
    @click="onActionClick"
  >
    <span
      class="bg-stone/10 absolute top-0 left-0 -z-1 size-40 animate-[zoomOut_0.3s_ease-out_both] rounded-full group-hover:animate-[zoomIn_0.3s_ease-out_both]"
    />

    <component
      v-if="item.icon"
      :is="item.icon"
      class="block size-24"
      data-testpl="patient-header-navigation-list-item-icon"
    />

    <BaseCounter
      v-if="item.counter"
      :model-value="item.counter"
      class="absolute top-0 right-0 z-1"
      size="16"
      data-testpl="patient-header-navigation-list-item-counter"
    />
  </component>
</template>

<style scoped>
@reference '@/assets/css/main.css';

.menu-item.router-link-active {
  @apply pointer-events-none;
}
</style>
