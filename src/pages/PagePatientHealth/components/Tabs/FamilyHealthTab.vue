<script setup lang="ts">
import type { FamilyHistory } from '@/api/integrations/mammoth/types.ts';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseTabs from '@/components/BaseTabs/BaseTabs.vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  data?: FamilyHistory[];
}>();

const { t } = useI18n();

const currentTab = ref('living');
const isShowMore = ref(false);
const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const numberDisplayedItems = computed(() => {
  return greaterOrEqualLg.value ? 6 : 3;
});

const tabs = computed(() => {
  return [
    {
      label: `${t('living')} (${livingHistory.value.length})`,
      id: 'living',
    },
    {
      label: `${t('deceased')} (${deceasedHistory.value.length})`,
      id: 'deceased',
    },
  ].filter((tab) => {
    if (livingHistory.value.length === 0 && tab.id === 'living') {
      return false;
    }
    return !(deceasedHistory.value.length === 0 && tab.id === 'deceased');
  });
});

const livingHistory = computed(() => {
  if (!props.data) return [];

  return props.data.filter((item) => {
    return !item.deceased;
  });
});

const deceasedHistory = computed(() => {
  if (!props.data) return [];

  return props.data.filter((item) => {
    return item.deceased;
  });
});

const displayList = computed(() => {
  if (isShowMore.value) {
    return currentTab.value === 'living' ? livingHistory.value : deceasedHistory.value;
  } else {
    return currentTab.value === 'living'
      ? livingHistory.value.slice(0, numberDisplayedItems.value)
      : deceasedHistory.value.slice(0, numberDisplayedItems.value);
  }
});

if (livingHistory.value.length === 0) {
  currentTab.value = 'deceased';
} else {
  currentTab.value = 'living';
}

watch(currentTab, () => {
  isShowMore.value = false;
});
</script>

<template>
  <section class="rounded-b-8 rounded-tr-8 flex flex-col gap-32 bg-white p-24">
    <div class="flex flex-col justify-between gap-16 lg:flex-row lg:items-center">
      <h2 class="text-26 font-secondary">{{ $t('familyHealthHistory') }}</h2>
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
        <span class="text-12 text-beige font-medium uppercase">{{ item.relationship }}</span>
        <div class="flex flex-col">
          <span v-for="condition in item.conditions" :key="condition.id">
            {{ condition.problem }}
          </span>
        </div>
      </div>
    </div>
    <span v-else class="text-14 text-stone">{{ $t('noData') }}</span>
    <BaseButton
      v-if="
        currentTab === 'living'
          ? livingHistory.length > numberDisplayedItems
          : deceasedHistory.length > numberDisplayedItems
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
