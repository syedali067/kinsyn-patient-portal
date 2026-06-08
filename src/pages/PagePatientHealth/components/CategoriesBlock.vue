<script setup lang="ts">
import IconCheck from '@/assets/icons/check.svg?component';
import IconFilter from '@/assets/icons/filter.svg?component';
import BasePopover from '@/components/BasePopover/BasePopover.vue';
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
import type { BiomarkersCategory } from '@/types/health.ts';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  categories?: BiomarkersCategory[];
  filter?: {
    id: string;
    label: string;
  };
  tab?: string;
}>();

const { t } = useI18n();
const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

// Placeholder categories for empty state
const placeholderCategories = [
  { name: 'Autoimmunity', count: 5 },
  { name: 'Biological Age', count: 1 },
  { name: 'Blood', count: 11 },
  { name: 'Bone Health', count: 8 },
  { name: 'Brain Health', count: 5 },
  { name: 'Electrolytes', count: 6 },
  { name: 'Environmental Toxins', count: 15 },
  { name: 'Female Health', count: 10 },
  { name: 'Food Allergies & Sensitivities', count: 18 },
  { name: 'Heart', count: 29 },
  { name: 'Immune Regulation', count: 23 },
  { name: 'In/Outdoor Allergies', count: 26 },
  { name: 'Kidney', count: 10 },
  { name: 'Liver', count: 9 },
  { name: 'Metabolic', count: 9 },
  { name: 'Nutrients', count: 20 },
  { name: 'Pancreas', count: 2 },
  { name: 'Stress & Aging', count: 5 },
  { name: 'Thyroid', count: 5 },
  { name: 'Urine', count: 15 },
];

const chunkedPlaceholderCategories = computed(() => {
  const chunkSize = greaterOrEqualLg.value ? 3 : 2;
  const result = [];
  for (let i = 0; i < placeholderCategories.length; i += chunkSize) {
    result.push(placeholderCategories.slice(i, i + chunkSize));
  }
  return result;
});

const filterItems = ref([
  {
    label: t('all'),
    id: 'all',
  },
  {
    label: t('inRange'),
    id: 'inRange',
  },
  {
    label: t('outOfRange'),
    id: 'outOfRange',
  },
  {
    label: t('improving'),
    id: 'improving',
  },
]);

const currentFilter = ref(
  filterItems.value.find((item) => item.id === props.filter?.id) || filterItems.value[0],
);

const barStyle = (value: number) => {
  const max = 25;
  const minWidth = 12;
  if (value >= max) return { width: '100%' };
  const percent = (value / max) * 100;
  return { width: `max(${minWidth}px, ${percent}%)` };
};

const sortByName = <T extends { name: string }>(arr: T[]) =>
  [...arr].sort((a, b) => a.name.localeCompare(b.name));

const filteredCategories = computed(() => {
  if (!props.categories?.length) return [];
  const categoriesWithBiomarkers = props.categories.filter((category) => category.data.length > 0);

  if (currentFilter.value?.id === 'inRange') {
    return sortByName(
      categoriesWithBiomarkers
        .map((item) => ({ ...item, name: item.name, inRange: item.inRange, outOfRange: 0 }))
        .filter((el) => el.inRange),
    );
  }
  if (currentFilter.value?.id === 'outOfRange') {
    return sortByName(
      categoriesWithBiomarkers
        .map((item) => ({ ...item, name: item.name, outOfRange: item.outOfRange, inRange: 0 }))
        .filter((el) => el.outOfRange),
    );
  }
  if (currentFilter.value?.id === 'improving') {
    return sortByName(
      categoriesWithBiomarkers
        .map((item) => ({
          ...item,
          name: item.name,
          inRange: item.inRange,
          outOfRange: item.outOfRange,
        }))
        .filter((el) => el.improving),
    );
  }
  return sortByName(categoriesWithBiomarkers);
});

const chunkedCategories = computed(() => {
  const chunkSize = greaterOrEqualLg.value ? 3 : 2;
  const result = [];
  for (let i = 0; i < filteredCategories.value.length; i += chunkSize) {
    result.push(filteredCategories.value.slice(i, i + chunkSize));
  }
  return result;
});

watch(
  () => props.filter,
  (value) => {
    currentFilter.value =
      filterItems.value.find((item) => item.id === value?.id) || filterItems.value[0]!;
  },
  { deep: true },
);
</script>

<template>
  <div class="rounded-8 flex flex-col gap-24 bg-white p-24 lg:gap-40">
    <div class="flex flex-col justify-between gap-24 lg:flex-row lg:items-center">
      <h2 class="text-26 font-secondary">
        {{ $t('categories') }}
        <span v-if="filteredCategories?.length">({{ filteredCategories.length }})</span>
      </h2>
      <BasePopover v-if="categories?.length">
        <template #trigger="{ open }">
          <button
            type="button"
            :class="{ 'text-beige': open }"
            class="text-14 flex w-fit flex-row-reverse items-center gap-4 lg:flex-row"
          >
            {{ $t('show') }}: {{ currentFilter?.label }}
            <IconFilter class="size-16" />
          </button>
        </template>

        <template #content="{ close }">
          <div class="flex w-210 flex-col gap-16 p-24">
            <span class="text-10 text-stone font-medium uppercase">{{ $t('show') }}</span>
            <button
              v-for="item in filterItems"
              :key="item.id"
              type="button"
              class="text-14 flex items-center justify-between text-left hover:font-medium"
              :class="[{ 'font-medium': item.id === currentFilter?.id }]"
              @click="
                currentFilter = item;
                close();
              "
            >
              {{ item.label }}
              <IconCheck v-if="item.id === currentFilter?.id" class="size-20" />
            </button>
          </div>
        </template>
      </BasePopover>
    </div>
    <BaseSeparator v-if="!greaterOrEqualLg" class="bg-bone" />
    <div v-if="categories?.length" class="divide-bone divide-y">
      <div
        v-for="(row, rowIndex) in chunkedCategories"
        :key="rowIndex"
        class="grid grid-cols-2 gap-x-16 py-12 lg:grid-cols-3"
      >
        <RouterLink
          :to="{
            name: 'PatientCategoryBiomarkers',
            params: {
              tab: props.tab,
              categorySlug: category.slug,
            },
          }"
          v-for="(category, index) in row"
          :key="index"
          class="hover:bg-bone/50 rounded-8 flex flex-col gap-8 p-12"
        >
          <h3>{{ category.name }}</h3>

          <div class="flex items-center gap-4">
            <template v-if="category.inRange">
              <div class="rounded-2 bg-jungle-green h-8" :style="barStyle(category.inRange)" />
              <span class="text-12 mr-4">
                {{ category.inRange }}
              </span>
            </template>

            <template v-if="category.outOfRange">
              <div class="bg-light-coral rounded-2 h-8" :style="barStyle(category.outOfRange)" />
              <span class="text-12">
                {{ category.outOfRange }}
              </span>
            </template>
          </div>
        </RouterLink>
      </div>
    </div>
    <div v-else class="divide-bone divide-y">
      <div
        v-for="(row, rowIndex) in chunkedPlaceholderCategories"
        :key="rowIndex"
        class="grid grid-cols-2 gap-x-16 py-12 lg:grid-cols-3"
      >
        <div
          v-for="(category, index) in row"
          :key="index"
          class="rounded-8 flex flex-col gap-8 p-12"
        >
          <h3 class="text-stone">{{ category.name }}</h3>
          <div class="flex items-center gap-4">
            <div class="bg-bone rounded-2 h-8" :style="barStyle(category.count)" />
            <span class="text-12 text-stone">{{ category.count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
