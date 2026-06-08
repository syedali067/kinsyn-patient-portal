<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import PoweredBy from '@/components/PoweredBy/PoweredBy.vue';
import SafeText from '@/components/SafeText/SafeText.vue';
import { messageOptions } from '@/utils/htmlSanitizerOptions.ts';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { format } from 'date-fns';
import { ref, onMounted, nextTick, watch, computed } from 'vue';

const props = defineProps<{
  title?: string;
  date?: string;
  text?: string;
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const formattedDate = computed(() => {
  if (!props.date) return '';
  return format(new Date(props.date), 'MMMM d, yyyy');
});

const textRef = ref<InstanceType<typeof SafeText> | null>(null);
const showClamp = ref(false);
const isExpanded = ref(false);

const measureHeight = async () => {
  await nextTick();

  const el = textRef.value?.element;
  if (el && props.text) {
    const height = el.offsetHeight;
    const maxHeight = greaterOrEqualLg.value ? 147 : 84;

    showClamp.value = height > maxHeight;
  }
};

onMounted(async () => {
  await measureHeight();
});

watch(
  () => props.text,
  async () => {
    await measureHeight();
  },
);

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};
</script>
<template>
  <div
    class="rounded-8 flex flex-col gap-32 bg-white p-24"
    :class="{ 'lg:h-383 lg:overflow-hidden': showClamp && !isExpanded }"
  >
    <div class="flex flex-col gap-24 lg:gap-32">
      <div class="flex items-center justify-between">
        <h2 class="text-26 font-secondary">{{ title }}</h2>
        <PoweredBy v-if="greaterOrEqualLg" />
      </div>

      <div class="flex flex-col gap-24">
        <span
          class="text-12 text-secondary-text bg-bone rounded-20 flex h-31 w-fit items-center justify-center px-12 py-8"
        >
          {{ formattedDate }}
        </span>
        <div
          class="relative overflow-hidden transition-all duration-300"
          :class="{
            'max-h-147': showClamp && !isExpanded && greaterOrEqualLg,
            'max-h-84': showClamp && !isExpanded && !greaterOrEqualLg,
          }"
        >
          <SafeText
            :text="text"
            ref="textRef"
            :options="messageOptions"
            class="text-14 prose leading-[150%]"
          />
          <div
            v-if="showClamp && !isExpanded"
            class="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-white to-transparent"
          />
        </div>
      </div>
    </div>
    <BaseButton v-if="showClamp" class="min-w-200 shrink-0 lg:w-fit" @click="toggleExpanded">
      {{ isExpanded ? $t('showLess') : $t('readMore') }}
    </BaseButton>

    <PoweredBy v-if="!greaterOrEqualLg" />
  </div>
</template>
