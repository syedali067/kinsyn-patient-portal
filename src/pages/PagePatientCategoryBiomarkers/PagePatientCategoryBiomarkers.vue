<script setup lang="ts">
import BiomarkerDetailModal from './components/BiomarkerDetailModal.vue';
import CategoriesModal from './components/CategoriesModal.vue';
import { useBiomarkers } from './composables/useBiomarkers.ts';
import { apiHealth } from '@/api/health/apiHealth.ts';
import IconArrowLeft from '@/assets/icons/arrow-left.svg?component';
import IconCheck from '@/assets/icons/check.svg?component';
import IconDna from '@/assets/icons/dna.svg?component';
import IconFilter from '@/assets/icons/filter.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BasePopover from '@/components/BasePopover/BasePopover.vue';
import InsightsBlock from '@/components/InsightsBlock/InsightsBlock.vue';
import SafeText from '@/components/SafeText/SafeText.vue';
import { useAiSettings } from '@/composables/useAiSettings.ts';
import { useBiomarkers as useBiomarkersGlobal } from '@/composables/useBiomarkers.ts';
import { usePostHog } from '@/composables/usePostHog.ts';
import { useTrueDiagnostics } from '@/composables/useTrueDiagnostics.ts';
import type { Biomarker } from '@/types/health.ts';
import { messageOptions } from '@/utils/htmlSanitizerOptions.ts';
import { breakpointsTailwind, useBreakpoints, useWindowScroll } from '@vueuse/core';
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const { aiSettingsEnabled, getAiSettings } = useAiSettings();
const { questBiomarkers } = useBiomarkersGlobal();
const { trueDiagnostics } = useTrueDiagnostics();
const {
  getLeftRedWidth,
  getGreenWidth,
  getRightRedWidth,
  getMarkerPosition,
  getStatusClass,
  getRangeParts,
  getMinValue,
  getMaxValue,
  hasNumericRange,
  isNumericValue,
} = useBiomarkers();
const route = useRoute();
const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');
const { posthog } = usePostHog();

posthog.onFeatureFlags(() => {
  if (posthog.isFeatureEnabled('patient-portal-ai-settings')) {
    getAiSettings();
  }
});

const { y: scrollY } = useWindowScroll();
const isScrolled = computed(() => scrollY.value > 0);

await Promise.all([apiHealth.getQuestBiomarkers(), apiHealth.getTrueDiagnosticBiomarkers()]);

const currentCategorySlug = ref('');
const currentBiomarker = ref<Biomarker | null>(null);
const isCategoriesModalOpen = ref(false);
const isShowMore = ref(false);
const isBiomarkerDetailModalOpen = ref(false);

const labTests = computed(() => {
  return {
    summary: {
      createdAt:
        questBiomarkers.value?.summary?.createdAt ||
        trueDiagnostics.value?.summary?.createdAt ||
        '',
      insights:
        questBiomarkers.value?.summary?.insights || trueDiagnostics.value?.summary?.insights || '',
    },
    categories: [
      ...(questBiomarkers.value?.categories || []),
      ...(trueDiagnostics.value?.categories || []),
    ],
  };
});

const categoryData = computed(() => {
  return labTests.value?.categories.find((category) => category.slug === currentCategorySlug.value);
});

watch(
  () => route.params.categorySlug,
  (value) => {
    if (value) {
      currentCategorySlug.value = value as string;
    }
  },
  { immediate: true },
);

const currentBiomarkers = computed(() => {
  return labTests.value?.categories.find((category) => category.slug === currentCategorySlug.value)
    ?.data;
});

const categoriesWithBiomarkers = computed(() => {
  return (
    labTests.value?.categories
      .filter((category) => category.data.length > 0)
      .sort((a, b) => a.name.localeCompare(b.name)) || []
  );
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

const currentFilter = ref(filterItems.value[0]);

const filteredBiomarkers = computed(() => {
  if (!currentBiomarkers.value?.length) return [];

  let filtered = [];
  if (currentFilter.value?.id === 'inRange') {
    filtered = currentBiomarkers.value.filter((item) => item.rangeDescription.includes('In range'));
  } else if (currentFilter.value?.id === 'outOfRange') {
    filtered = currentBiomarkers.value.filter(
      (item) => item.rangeDescription.includes('Above') || item.rangeDescription.includes('Below'),
    );
  } else if (currentFilter.value?.id === 'improving') {
    filtered = currentBiomarkers.value.filter((item) => item.isImproved);
  } else {
    filtered = currentBiomarkers.value;
  }

  return filtered.sort((a, b) => {
    if (a.inRange !== b.inRange) {
      return a.inRange ? 1 : -1;
    }

    return a.parameterName.localeCompare(b.parameterName);
  });
});

const displayListBiomarkers = computed(() => {
  if (greaterOrEqualLg.value) {
    return isShowMore.value
      ? filteredBiomarkers.value
      : filteredBiomarkers.value?.slice(0, 12) || [];
  }

  return isShowMore.value ? filteredBiomarkers.value : filteredBiomarkers.value?.slice(0, 5) || [];
});
</script>

<template>
  <div class="relative flex flex-col gap-24 lg:gap-40">
    <div
      class="flex items-center justify-between gap-12"
      :class="[
        { 'bg-site-bg sticky top-52 right-0 left-0 z-1000': !greaterOrEqualLg },
        { 'py-12': isScrolled && !greaterOrEqualLg },
      ]"
    >
      <div class="flex items-center gap-12">
        <BaseButton
          :to="{ name: 'PatientHealth' }"
          color="light"
          size="40"
          rounded
          data-testpl="back-to-health-button"
        >
          <template #prepend>
            <IconArrowLeft class="size-20" />
          </template>
        </BaseButton>
        <span v-if="greaterOrEqualLg" class="text-21 font-secondary">{{ $t('myHealth') }}</span>
      </div>
      <button
        type="button"
        v-if="!greaterOrEqualLg"
        class="flex items-center gap-8"
        data-testpl="categories-button"
        @click="isCategoriesModalOpen = true"
      >
        <span>{{ $t('categories') }}</span>
        <IconDna />
      </button>
    </div>

    <div class="relative flex gap-24">
      <div
        v-if="greaterOrEqualLg"
        class="rounded-8 sticky top-100 flex h-fit min-w-375 flex-col gap-16 bg-white px-16 py-32"
      >
        <RouterLink
          v-for="category in categoriesWithBiomarkers"
          :key="category.name"
          :to="{
            name: 'PatientCategoryBiomarkers',
            params: {
              categorySlug: category.slug,
            },
          }"
          class="rounded-4 hover:bg-bone/50 flex h-38 items-center px-12 text-left"
          data-testpl="category-button"
          :class="{
            'bg-bone/50': currentCategorySlug === category.slug,
          }"
          @click="currentCategorySlug = category.slug"
        >
          <span>
            {{ category.name }}
            <sup class="text-12 text-disabled-text align-start ml-2">
              {{ category.data.length }}
            </sup>
          </span>
        </RouterLink>
      </div>

      <div class="flex w-full flex-col gap-24">
        <div class="rounded-8 relative h-240 overflow-hidden">
          <img
            src="@/assets/images/book.jpg"
            alt="book"
            draggable="false"
            class="absolute inset-0 h-full w-full scale-[1.5] object-cover object-[40%_85%] select-none"
            data-testpl="category-image"
          />
          <div class="absolute inset-0 bg-[#222222]/65" />

          <div
            class="absolute inset-0 flex flex-col justify-end gap-4 p-24 text-white lg:gap-8 lg:p-32"
            data-testpl="category-name"
          >
            <h1 class="text-32 lg:text-48 font-secondary">{{ categoryData?.name }}</h1>
            <p class="lg:text-18">{{ categoryData?.description }}</p>
          </div>
        </div>

        <InsightsBlock
          v-if="labTests?.summary.insights && aiSettingsEnabled"
          :title="$t('biomarkerInsights')"
          :date="labTests?.summary.createdAt"
          :text="labTests?.summary.insights"
        />

        <div class="rounded-8 flex flex-col gap-35 bg-white p-24">
          <div class="flex flex-col justify-between gap-24 lg:flex-row lg:items-center">
            <span class="text-26 font-secondary">
              {{ $t('biomarkers') }} ({{ filteredBiomarkers?.length }})
            </span>

            <BasePopover>
              <template #trigger="{ open }">
                <button
                  type="button"
                  :class="{ 'text-beige': open }"
                  class="text-14 flex w-fit flex-row-reverse items-center gap-4 lg:flex-row"
                  data-testpl="filter-button"
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
                    data-testpl="filter-item"
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

          <div class="relative grid grid-cols-1 items-start gap-45 lg:grid-cols-2 lg:gap-48">
            <button
              type="button"
              v-for="item in displayListBiomarkers"
              :key="item.parameterName"
              :class="{ 'hover:bg-site-bg rounded-4 p-12': greaterOrEqualLg }"
              data-testpl="biomarker-button"
              @click="
                isBiomarkerDetailModalOpen = true;
                currentBiomarker = item;
              "
            >
              <span class="mb-8 flex items-center justify-between gap-8">
                <span class="text-14 text-left">{{ item.parameterName }}</span>

                <span
                  class="text-10 shrink-0 font-medium uppercase"
                  :class="{
                    'text-disabled-text': item.inRange === null,
                    'text-jungle-green': item.inRange === true,
                    'text-light-coral': item.inRange === false,
                  }"
                >
                  {{ item.rangeDescription }}
                </span>
              </span>

              <span
                v-if="item.parameterSubname"
                class="text-10 text-secondary-text block w-full text-left"
              >
                ({{ item.parameterSubname }})
              </span>

              <span class="mb-4 flex items-baseline gap-8">
                <span
                  class="text-26 lg:text-32 font-secondary"
                  :class="{ 'normal-case': !item.referenceRange }"
                  data-testpl="biomarker-value"
                >
                  {{ item.parameterValue }}<span v-if="item.previousValues?.length">*</span>
                </span>
                <span class="text-14 text-secondary-text" data-testpl="biomarker-units">
                  {{ item.units }}
                </span>
              </span>

              <span class="relative flex h-4 items-center">
                <span
                  v-if="!hasNumericRange(item) || !isNumericValue(item)"
                  class="size-full rounded"
                  :class="{
                    'bg-jungle-green': item.inRange === true,
                    'bg-light-coral': item.inRange === false,
                    'bg-disabled-bg': item.inRange === null,
                  }"
                  data-testpl="biomarker-range"
                />

                <template v-else>
                  <div
                    v-if="getLeftRedWidth(item) > 0"
                    class="bg-light-coral h-full rounded"
                    :style="{ width: getLeftRedWidth(item) + '%' }"
                  />

                  <div v-if="getLeftRedWidth(item) > 0" class="w-3"></div>

                  <div
                    class="bg-jungle-green h-full rounded"
                    :style="{ width: getGreenWidth(item) + '%' }"
                  />

                  <div v-if="getRightRedWidth(item) > 0" class="w-3" />

                  <div
                    v-if="getRightRedWidth(item) > 0"
                    class="bg-light-coral h-full rounded"
                    :style="{ width: getRightRedWidth(item) + '%' }"
                  />

                  <div
                    class="absolute top-9 h-0 w-0 border-r-7 border-b-12 border-l-7 border-transparent"
                    :class="{
                      'border-b-jungle-green': getStatusClass(item) === 'in-range',
                      'border-b-light-coral':
                        getStatusClass(item) === 'above' || getStatusClass(item) === 'below',
                    }"
                    :style="{ left: getMarkerPosition(item) + '%', transform: 'translateX(-50%)' }"
                  />
                </template>
              </span>

              <span v-if="hasNumericRange(item)" class="text-12 text-stone relative mt-1 block">
                <template v-if="item.rangeDescription.includes('In range')">
                  <span class="absolute left-0">{{ getRangeParts(item.referenceRange)[0] }}</span>
                  <span class="absolute right-0">{{ getRangeParts(item.referenceRange)[1] }}</span>
                </template>

                <template v-else-if="item.rangeDescription.includes('Above range')">
                  <span class="absolute" :style="{ left: getGreenWidth(item) + '%' }">
                    {{ getRangeParts(item.referenceRange)[1] }}
                  </span>
                  <span class="absolute right-0"
                    >&gt; {{ getRangeParts(item.referenceRange)[1] }}</span
                  >
                </template>

                <template v-else-if="item.rangeDescription.includes('Below range')">
                  <span class="absolute left-0"
                    >&lt; {{ getRangeParts(item.referenceRange)[0] }}</span
                  >
                  <span class="absolute" :style="{ left: getLeftRedWidth(item) + '%' }">
                    {{ getRangeParts(item.referenceRange)[0] }}
                  </span>
                </template>

                <template v-else>
                  <span class="absolute left-0">{{ getMinValue(item)?.toFixed(1) }}</span>
                  <span class="absolute right-0">{{ getMaxValue(item)?.toFixed(1) }}</span>
                </template>
              </span>

              <span
                v-if="item.previousValues?.length"
                class="text-10 text-secondary-text mt-24 block text-left"
              >
                *{{ $t('correctedResult') }}. {{ $t('previousReportedResult') }}:
                {{ item.previousValues.at(-1)?.value }},
                <span class="lowercase"> {{ $t('date') }} </span>:
                {{ item.previousValues.at(-1)?.date }}
              </span>
            </button>

            <BaseButton
              v-if="
                greaterOrEqualLg ? filteredBiomarkers.length > 12 : filteredBiomarkers.length > 4
              "
              :class="{ 'sticky bottom-10': isShowMore, 'col-span-2': greaterOrEqualLg }"
              data-testpl="show-more-button"
              @click="isShowMore = !isShowMore"
            >
              {{ isShowMore ? $t('showLess') : $t('showMore') }}
            </BaseButton>
          </div>
        </div>

        <div class="rounded-8 flex flex-col gap-24 bg-white p-24">
          <span class="text-26 font-secondary" data-testpl="about-category-name"
            >{{ $t('about') }} {{ categoryData?.name }}</span
          >
          <SafeText :text="categoryData?.about" :options="messageOptions" class="text-14 prose" />
        </div>
      </div>
    </div>
    <CategoriesModal
      v-model:open="isCategoriesModalOpen"
      :category-slug="currentCategorySlug"
      :categories="categoriesWithBiomarkers || []"
      @close="isCategoriesModalOpen = false"
    />
    <BiomarkerDetailModal
      v-if="currentBiomarker"
      v-model:open="isBiomarkerDetailModalOpen"
      :current-biomarker="currentBiomarker"
      :biomarkers="filteredBiomarkers"
      :date="labTests?.summary.createdAt"
      :ai-settings-enabled="aiSettingsEnabled"
      @update:current-biomarker="currentBiomarker = $event"
    />
  </div>
</template>
