<script setup lang="ts">
import type { ContentItem } from '../types';
import IconCheck from '@/assets/icons/check.svg?component';
import IconChevronDown from '@/assets/icons/chevron-down.svg?component';
import IconChevronUp from '@/assets/icons/chevron-up.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  injectAccordionRootContext,
} from 'reka-ui';
import { computed } from 'vue';

const props = defineProps<{
  item: ContentItem;
  stagesCompleted: string[];
  titleKey?: string;
  value: string;
}>();

const emit = defineEmits<{
  click: [value: string];
}>();

const rootContext = injectAccordionRootContext(null);

const isItemOpen = computed(() => {
  if (!rootContext) return false;
  const modelValue = rootContext.modelValue.value;
  if (Array.isArray(modelValue)) {
    return modelValue.includes(props.value);
  }
  return modelValue === props.value;
});

const handleChevronClick = () => {
  if (!rootContext || props.stagesCompleted.includes(props.item.id)) return;

  const currentValue = rootContext.modelValue.value;
  if (Array.isArray(currentValue)) {
    const newValue = currentValue.includes(props.value)
      ? currentValue.filter((v) => v !== props.value)
      : [...currentValue, props.value];
    rootContext.modelValue.value = newValue;
  } else {
    rootContext.modelValue.value = currentValue === props.value ? undefined : props.value;
  }
};
</script>

<template>
  <AccordionItem
    :value="value"
    class="overflow-hidden transition-opacity"
    :class="{
      'pointer-events-none cursor-progress opacity-50': item.loading,
    }"
  >
    <AccordionHeader>
      <div
        v-if="!isItemOpen"
        class="group rounded-4 flex w-full items-center justify-between gap-16 px-16 py-24 transition-colors hover:shadow-sm lg:flex-col lg:items-start lg:gap-8 lg:px-24"
        :class="[stagesCompleted.includes(item.id) ? 'bg-beige text-white' : 'bg-site-bg']"
        @click="handleChevronClick"
      >
        <div class="flex items-center gap-16">
          <component :is="item.icon" class="size-32 shrink-0" />
          <p v-if="titleKey">
            {{ titleKey }}
          </p>
        </div>
        <BaseButton
          v-if="!stagesCompleted.includes(item.id)"
          rounded
          color="gray"
          size="32"
          class="ml-auto shrink-0"
        >
          <template #prepend>
            <IconChevronDown class="size-20" />
          </template>
        </BaseButton>
        <div v-else class="flex size-32 items-center justify-center rounded-full bg-white">
          <IconCheck class="text-coal size-20" />
        </div>
      </div>
    </AccordionHeader>

    <AccordionContent
      class="rounded-8 relative overflow-hidden data-[state=closed]:h-0 data-[state=open]:h-466 data-[state=open]:animate-[slideInDown_0.3s]"
    >
      <div class="absolute inset-0">
        <img v-if="item.image" :src="item.image" :alt="item.title" class="size-full object-cover" />
      </div>
      <div v-if="item.id !== 'connectYourWearable'" class="bg-coal/40 absolute inset-0 z-5" />
      <div class="relative z-10 flex h-466 flex-col">
        <div
          class="flex w-full flex-row items-center justify-between gap-16 px-16 py-24"
          :class="[
            stagesCompleted.includes(item.id) ? 'bg-beige text-white' : 'bg-transparent text-white',
          ]"
        >
          <div
            :class="[item.id === 'connectYourWearable' ? 'text-black' : 'text-white']"
            class="flex items-center gap-16"
          >
            <component :is="item.icon" class="size-32 shrink-0" />
            <p v-if="titleKey">
              {{ titleKey }}
            </p>
          </div>
          <BaseButton
            v-if="!stagesCompleted.includes(item.id)"
            rounded
            :color="item.id === 'connectYourWearable' ? 'dark' : 'gray'"
            size="32"
            class="shrink-0"
            @click="handleChevronClick"
          >
            <template #prepend>
              <IconChevronUp class="size-20" />
            </template>
          </BaseButton>
        </div>
        <div
          class="mt-auto flex flex-col gap-16 px-24 pb-24"
          :class="[item.id === 'connectYourWearable' ? 'text-black' : 'text-white']"
        >
          <p v-if="item.description" class="text-21 font-secondary">
            {{ item.description }}
          </p>
          <BaseButton
            v-if="item.buttonTitle"
            class="w-fit"
            color="light"
            @click="emit('click', item.id)"
          >
            {{ item.buttonTitle }}
          </BaseButton>
        </div>
      </div>
    </AccordionContent>
  </AccordionItem>
</template>
