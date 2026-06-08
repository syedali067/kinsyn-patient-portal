<script setup lang="ts">
import IconChevronDown from '@/assets/icons/chevron-down.svg?component';
import type {
  BaseAccordionOrientation,
  BaseAccordionTheme,
  BaseAccordionType,
} from '@/components/BaseAccordion/types.ts';
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from 'reka-ui';

withDefaults(
  defineProps<{
    length: number;
    type?: BaseAccordionType;
    defaultValue?: string;
    theme?: BaseAccordionTheme;
    orientation?: BaseAccordionOrientation;
    collapsible?: boolean;
  }>(),
  {
    length: 0,
    type: 'single',
    theme: 'clear',
    orientation: 'horizontal',
    collapsible: true,
  },
);
</script>

<template>
  <AccordionRoot :type :default-value :collapsible :orientation :data-orientation="orientation">
    <AccordionItem
      v-for="index in length"
      :key="`accordion-item-${index}`"
      :value="`accordion-item-${index}`"
      class="border-bone border-b"
      data-testpl="base-accordion-item"
    >
      <AccordionHeader
        v-if="$slots[`title-${index - 1}`]"
        class="relative z-1"
        data-testpl="base-accordion-header"
      >
        <AccordionTrigger
          class="group hover:text-beige data-[state=open]:text-beige flex w-full items-center justify-between gap-16 transition-colors"
          :class="{
            'bg-bone/50 rounded-8 p-32': theme === 'filled',
            'px-8 py-24': theme === 'clear',
          }"
          data-testpl="base-accordion-trigger"
        >
          <slot :name="`title-${index - 1}`" />

          <IconChevronDown class="size-20 group-data-[state=open]:scale-y-[-1]" />
        </AccordionTrigger>
      </AccordionHeader>

      <AccordionContent
        v-if="$slots[`content-${index - 1}`]"
        class="px-8"
        :class="{
          'py-32': theme === 'filled',
          '-mt-16 py-16 lg:-mt-32 lg:py-24': theme === 'clear',
        }"
        data-testpl="base-accordion-content"
      >
        <slot :name="`content-${index - 1}`" />
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
