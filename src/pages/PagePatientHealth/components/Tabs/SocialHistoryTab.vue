<script setup lang="ts">
import type { SocialHistory } from '@/api/integrations/mammoth/types.ts';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseTabs from '@/components/BaseTabs/BaseTabs.vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  data?: SocialHistory[];
}>();

const { t } = useI18n();

const currentTab = ref('valid');
const isShowMore = ref(false);
const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const numberDisplayedItems = computed(() => {
  return greaterOrEqualLg.value ? 6 : 3;
});

const tabs = computed(() => {
  return [
    {
      label: `${t('active')} (${activeHistory.value.length})`,
      id: 'active',
    },
    {
      label: `${t('past')} (${pastHistory.value.length})`,
      id: 'past',
    },
  ].filter((tab) => {
    if (activeHistory.value.length === 0 && tab.id === 'active') {
      return false;
    }
    return !(pastHistory.value.length === 0 && tab.id === 'past');
  });
});

const activeHistory = computed(() => {
  if (!props.data) return [];

  return props.data.filter((item) => {
    return !item.stopDate;
  });
});

const pastHistory = computed(() => {
  if (!props.data) return [];

  return props.data.filter((item) => {
    return item.stopDate;
  });
});

const displayList = computed(() => {
  if (isShowMore.value) {
    return currentTab.value === 'active' ? activeHistory.value : pastHistory.value;
  } else {
    return currentTab.value === 'active'
      ? activeHistory.value.slice(0, numberDisplayedItems.value)
      : pastHistory.value.slice(0, numberDisplayedItems.value);
  }
});

if (activeHistory.value.length === 0) {
  currentTab.value = 'past';
} else {
  currentTab.value = 'active';
}

watch(currentTab, () => {
  isShowMore.value = false;
});
</script>

<template>
  <section class="rounded-b-8 rounded-tr-8 flex flex-col gap-32 bg-white p-24">
    <div class="flex flex-col justify-between gap-16 lg:flex-row lg:items-center">
      <h2 class="text-26 font-secondary">{{ $t('socialHistory') }}</h2>
      <BaseTabs :tabs v-model="currentTab" />
    </div>

    <div
      v-if="data?.length"
      class="grid grid-cols-1 gap-16 lg:grid-cols-3"
      :class="{ 'max-h-340 overflow-auto': isShowMore }"
    >
      <div
        v-for="(item, index) in displayList"
        :key="index"
        class="bg-site-bg rounded-8 flex flex-col gap-8 px-16 py-24"
      >
        <span class="text-12 text-beige font-medium uppercase">{{
          item.title ?? $t('notSpecified')
        }}</span>
        <span>{{ item.description ?? $t('notSpecified') }}</span>
      </div>
    </div>
    <span v-else class="text-14 text-stone">{{ $t('noData') }}</span>
    <BaseButton
      v-if="
        currentTab === 'active'
          ? activeHistory.length > numberDisplayedItems
          : pastHistory.length > numberDisplayedItems
      "
      theme="outline"
      class="mb-24 w-fit"
      size="37"
      @click="isShowMore = !isShowMore"
    >
      {{ isShowMore ? $t('showLess') : $t('showMore') }}
    </BaseButton>
  </section>
</template>
