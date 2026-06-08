<script setup lang="ts">
import ClockLottie from '../ClockLottie.vue';
import InsightConditionsDrawer from './InsightConditionsDrawer.vue';
import ReactivateMembership from './ReactivateMembership.vue';
import type { GroupedConditionsLabel, GroupedConditionsLabels } from './types';
import IconBeat from '@/assets/icons/beat.svg?component';
import IconSearch from '@/assets/icons/search.svg?component';
import femaleDiagram from '@/assets/images/female-diagram.png';
import maleDiagram from '@/assets/images/male-diagram.png';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseSpinner from '@/components/BaseSpinner/BaseSpinner.vue';
import CompleteDetailsDrawer from '@/components/CompleteDetailsDrawer/CompleteDetailsDrawer.vue';
import PoweredBy from '@/components/PoweredBy/PoweredBy.vue';
import ReactivateTreatmentDrawer from '@/components/ReactivateTreatmentDrawer/ReactivateTreatmentDrawer.vue';
import { useHealth } from '@/composables/useHealth.ts';
import { useMammothFields } from '@/composables/useMammothFields';
import { useUserStore } from '@/stores/user';
import type { BodyPart, HealthInsightCondition } from '@/types/health.ts';
import type { Patient } from '@/types/integration';
import type { ModifiedSubscriptionItem } from '@/types/subscription';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  mammoth?: Patient;
  hasDeactivatedMembership: boolean;
  subscriptionItems: ModifiedSubscriptionItem[];
}>();

defineEmits<{
  refreshTreatments: [];
}>();

const filteredSubscriptionItems = computed(() => {
  if (!props.subscriptionItems.length) return [];
  const firstTreatmentId = props.subscriptionItems[0]?.treatmentId;
  return props.subscriptionItems.filter((item) => item.treatmentId === firstTreatmentId);
});

const {
  healthInsights,
  fetchInsights,
  fetchConditionInsights,
  isConditionInsightsLoading,
  conditionInsights,
  insightsBodyPartMap,
  isHealthInsightsLoading,
} = useHealth();
const userStore = useUserStore();
const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');
const { mammothFields } = useMammothFields();
const { t } = useI18n();

const isOpenDrawerReactivateTreatment = ref(false);

const bodyDiagram = computed(() => {
  return userStore.profile?.user.gender === 'M' ? maleDiagram : femaleDiagram;
});

fetchInsights();

const bodyPartHealthClassMap: Record<string, { dot: string; title: string; sortIndex: number }> = {
  head_and_brain: {
    dot: 'top-[4%] left-1/2 -translate-x-1/2',
    title: 'top-[4%]',
    sortIndex: 4,
  },
  throat_and_neck: {
    dot: 'top-[16%] left-1/2 -translate-x-1/2',
    title: 'top-[16%]',
    sortIndex: 16,
  },
  heart: {
    dot: 'top-[24%] left-[58%] -translate-x-1/2',
    title: 'top-[24%]',
    sortIndex: 24,
  },
  lungs: {
    dot: 'top-[24%] left-[42%] -translate-x-1/2',
    title: 'top-[24%]',
    sortIndex: 24,
  },
  breast_and_mammary: {
    dot: 'top-[20%] left-1/2 -translate-x-1/2',
    title: 'top-[20%]',
    sortIndex: 20,
  },
  upper_back: {
    dot: 'top-[27%] left-1/2 -translate-x-1/2',
    title: 'top-[27%]',
    sortIndex: 27,
  },
  lower_back: {
    dot: 'top-[40%] left-1/2 -translate-x-1/2',
    title: 'top-[40%]',
    sortIndex: 40,
  },
  abdomen: {
    dot: 'top-[33%] left-1/2 -translate-x-1/2',
    title: 'top-[33%]',
    sortIndex: 33,
  },
  kidneys: {
    dot: 'top-[36%] left-[60%] -translate-x-1/2',
    title: 'top-[36%]',
    sortIndex: 36,
  },
  pelvis: {
    dot: 'top-[46%] left-1/2 -translate-x-1/2',
    title: 'top-[46%]',
    sortIndex: 46,
  },
  shoulders: {
    dot: 'top-[19%] left-[70%] -translate-x-1/2',
    title: 'top-[19%]',
    sortIndex: 19,
  },
  arms_and_hands: {
    dot: 'top-[35%] left-[78%] -translate-x-1/2',
    title: 'top-[35%]',
    sortIndex: 35,
  },
  hips: {
    dot: 'top-[56%] left-[40%] -translate-x-1/2',
    title: 'top-[56%]',
    sortIndex: 56,
  },
  knees: {
    dot: 'top-[70%] left-[38%] -translate-x-1/2',
    title: 'top-[70%]',
    sortIndex: 70,
  },
  feet_and_ankles: {
    dot: 'top-[95%] left-[38%] -translate-x-1/2',
    title: 'top-[95%]',
    sortIndex: 95,
  },
  general_health: {
    dot: 'top-[10%] left-[85%] -translate-x-1/2',
    title: 'top-[10%]',
    sortIndex: 999, // will be displayed last in blocks
  },
};

const currentBodyPart = ref<BodyPart | null>(null);
const isCompleteDetailsWindowShowed = ref(false);

const isLoading = computed(() => isConditionInsightsLoading.value || isHealthInsightsLoading.value);

const conditionsWithClass = computed<HealthInsightCondition[]>(() => {
  return (
    healthInsights.value?.conditions.map((condition) => ({
      ...condition,
      class: bodyPartHealthClassMap[condition.bodyPart],
    })) || []
  );
});

const currentBodyPartTitle = computed(() => {
  if (!currentBodyPart.value) return '';
  return insightsBodyPartMap.value[currentBodyPart.value]?.label ?? '';
});

const groupedConditions = computed(() => {
  const map = new Map<BodyPart, HealthInsightCondition[]>();

  conditionsWithClass.value.forEach((condition) => {
    const key = condition.bodyPart;
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)?.push(condition);
  });

  // Sort by dot vertical position to avoid line crossings
  return Array.from(map.values()).sort((a, b) => {
    if (!a[0] || !b[0]) return 0;
    const aTop = bodyPartHealthClassMap[a[0].bodyPart]?.sortIndex ?? 100;
    const bTop = bodyPartHealthClassMap[b[0].bodyPart]?.sortIndex ?? 100;
    return aTop - bTop;
  });
});

const linesCoordinates = ref<
  { x1: number; y1: number; x2: number; y2: number; bodyPart: BodyPart }[]
>([]);
const diagramContainer = ref<HTMLElement | null>(null);

const handleDotClick = async (bodyPart?: BodyPart) => {
  if (!bodyPart) return;

  if (!greaterOrEqualLg.value) {
    currentBodyPart.value = bodyPart;
    await fetchConditionInsights(bodyPart);

    if (conditionInsights.value?.length) {
      isInsightConditionsDrawerOpened.value = true;
    }
  }
};

const updateAllLinesPositions = () => {
  if (!diagramContainer.value || !groupedConditions.value.length) {
    linesCoordinates.value = [];
    return;
  }

  const containerRect = diagramContainer.value.getBoundingClientRect();
  const newLines: typeof linesCoordinates.value = [];

  for (const group of groupedConditions.value) {
    const bodyPart = group[0]?.bodyPart;

    if (!bodyPart) return;

    // Skip general_health on desktop as it has no dot there
    if (bodyPart === 'general_health' && greaterOrEqualLg.value) continue;

    const dotElement = document.querySelector(
      `[data-dot-bodypart="${bodyPart}"]`,
    ) as HTMLElement | null;
    const textElement = document.querySelector(
      `.condition-text[data-bodypart="${bodyPart}"]`,
    ) as HTMLElement | null;

    if (!dotElement || !textElement || !textElement.offsetParent) continue;

    const dotRect = dotElement.getBoundingClientRect();
    const textRect = textElement.getBoundingClientRect();

    const x1 = dotRect.left - containerRect.left + dotRect.width / 2;
    const y1 = dotRect.top - containerRect.top + dotRect.height / 2;
    const x2 = textRect.left - containerRect.left;
    const y2 = textRect.top - containerRect.top + textRect.height / 2;

    newLines.push({ x1, y1, x2, y2, bodyPart });
  }

  linesCoordinates.value = newLines;
};

const waitForDiagramReady = async () => {
  await nextTick();

  const img = diagramContainer.value?.querySelector('img');
  if (img && !img.complete) {
    await new Promise<void>((resolve) =>
      img.addEventListener('load', () => resolve(), { once: true }),
    );
  }

  await new Promise((r) => requestAnimationFrame(() => r(null)));
};

onMounted(async () => {
  await waitForDiagramReady();
  updateAllLinesPositions();
});

watch(
  groupedConditions,
  async () => {
    await nextTick();
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    updateAllLinesPositions();
  },
  { flush: 'post' },
);

const getInsightConditionClass = (insightConditionClass: HealthInsightCondition['class']) => {
  if (!insightConditionClass || typeof insightConditionClass === 'string') return undefined;

  return {
    dot: insightConditionClass.dot,
    title: insightConditionClass.title,
  };
};

// cache the labels to avoid re-rendering the component when the labels are the same
const groupedConditionsLabels = computed<GroupedConditionsLabels>(() => {
  const labels: GroupedConditionsLabels = {};

  for (const group of groupedConditions.value) {
    const bodyPart = group[0]?.bodyPart;

    if (bodyPart) {
      labels[bodyPart] = getGroupedConditionsLabel(group);
    }
  }

  return labels;
});

const maxGroupedConditionsLabelsCount = 3;

const getGroupedConditionsLabel = (group: HealthInsightCondition[]): GroupedConditionsLabel => {
  if (greaterOrEqualLg.value) {
    const titles = group.map((condition: HealthInsightCondition) => condition.title);

    return {
      main: `${titles.slice(0, maxGroupedConditionsLabelsCount).join(', ')}`,
      moreCount: Math.max(0, titles.length - maxGroupedConditionsLabelsCount),
    };
  } else {
    return {
      main: `${group.length} ${t('condition', group.length)}`,
      moreCount: 0,
    };
  }
};

const isInsightConditionsDrawerOpened = ref(false);
const handleShowAll = async (group: HealthInsightCondition[]) => {
  const first = group[0];
  if (!first) return;

  currentBodyPart.value = first.bodyPart;
  isInsightConditionsDrawerOpened.value = true;
  await fetchConditionInsights(first.bodyPart);
};

const handleViewAllConditions = () => {
  conditionInsights.value = healthInsights.value?.conditions ?? null;
  isInsightConditionsDrawerOpened.value = true;
};

watch(isInsightConditionsDrawerOpened, (newVal) => {
  if (!newVal) {
    currentBodyPart.value = null;
    conditionInsights.value = null;
  }
});

const activeConditionsCount = computed(() => healthInsights.value?.conditions?.length ?? 0);
</script>

<template>
  <section class="mb-40 flex flex-col gap-16 lg:gap-40">
    <div class="flex flex-col justify-between gap-4 lg:flex-row lg:items-center lg:gap-16">
      <h2 class="font-secondary text-24 lg:text-40">{{ $t('personalizedInsights') }}</h2>

      <i18n-t
        v-if="!greaterOrEqualLg && activeConditionsCount && !hasDeactivatedMembership"
        keypath="youHaveActiveConditions"
        tag="div"
        class="text-14"
      >
        <template #info>
          <span class="text-link-text font-medium lowercase">
            {{ activeConditionsCount }} {{ $t('activeConditions') }}
          </span>
        </template>
      </i18n-t>

      <PoweredBy v-if="greaterOrEqualLg && !hasDeactivatedMembership" />
    </div>

    <ReactivateMembership
      v-if="hasDeactivatedMembership"
      @open-modal="isOpenDrawerReactivateTreatment = true"
    />

    <div
      v-else
      ref="diagramContainer"
      class="diagram-container rounded-8 row bg-bone relative -mx-16 lg:mx-0 lg:min-h-600"
    >
      <BaseSpinner
        v-if="isLoading && !greaterOrEqualLg"
        class="text-stone absolute top-1/3 left-1/2 z-50 size-64 -translate-x-1/2 -translate-y-1/2"
      />

      <figure
        v-if="!hasDeactivatedMembership"
        class="relative col-span-3 h-fit lg:col-span-4 lg:ml-auto"
      >
        <img
          class="relative z-1 mx-auto h-auto max-h-[80vh] w-fit object-contain lg:ml-0 lg:max-h-none lg:w-250"
          :src="bodyDiagram"
          :alt="userStore.profile?.user.gender === 'M' ? 'male' : 'female'"
        />

        <template v-for="group in groupedConditions" :key="`${group[0]?.bodyPart}`">
          <div
            v-if="group[0]?.bodyPart !== 'general_health'"
            class="absolute z-10 size-14 -translate-y-1/2 rounded-full border-2"
            :class="[
              getInsightConditionClass(group[0]?.class)?.dot || '',
              currentBodyPart === group[0]?.bodyPart
                ? 'bg-beige border-white'
                : 'border-beige bg-white',
              { 'opacity-30': isConditionInsightsLoading },
              {
                'opacity-50':
                  group[0] && ['upper_back', 'lower_back', 'kidneys'].includes(group[0].bodyPart),
              },
            ]"
            :data-dot-bodypart="group[0]?.bodyPart"
            @click="handleDotClick(group[0]?.bodyPart)"
          />
        </template>
      </figure>

      <!-- Blocks - flex column (same for mobile and desktop) -->
      <div class="relative z-2 col-span-1 flex flex-col lg:col-span-3">
        <div class="mt-20 -ml-50 flex flex-col gap-10 lg:mt-10 lg:ml-0">
          <div
            v-for="(group, index) in groupedConditions"
            :key="index"
            class="rounded-4 text-12 condition-text text-coal w-fit cursor-pointer bg-white px-16 py-12 transition-colors lg:w-full"
            :class="{
              '!bg-beige text-white':
                currentBodyPart === group[0]?.bodyPart && isInsightConditionsDrawerOpened,
            }"
            :data-bodypart="group[0]?.bodyPart"
            @click="!isConditionInsightsLoading && handleShowAll(group)"
          >
            <template v-if="group[0]?.bodyPart === 'general_health'">
              <p v-if="greaterOrEqualLg" class="font-medium capitalize">
                {{ $t('generalConditions') }}:
              </p>
              <p v-else class="font-normal">
                {{ $t('general') }}
              </p>
            </template>

            <template v-if="group[0]">
              {{ groupedConditionsLabels[group[0].bodyPart]?.main }}
            </template>

            <template v-if="group[0] && groupedConditionsLabels[group[0].bodyPart]?.moreCount">
              {{ $t('and') }}

              <span class="font-medium lowercase underline">
                {{ groupedConditionsLabels[group[0].bodyPart]?.moreCount }}&nbsp;{{ $t('more') }}
              </span>
            </template>
          </div>
        </div>
      </div>

      <!-- Lines under figure (for back/kidneys - visible through transparent PNG) -->
      <svg
        class="pointer-events-none absolute top-0 left-0 size-full lg:block"
        :style="{ outline: '1px solid transparent' }"
      >
        <line
          v-for="line in linesCoordinates.filter((l) =>
            ['upper_back', 'lower_back', 'kidneys'].includes(l.bodyPart),
          )"
          :key="line.bodyPart"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          stroke="#A5906F"
          stroke-width="1"
          :style="{ vectorEffect: 'non-scaling-stroke' }"
        />
      </svg>

      <!-- Lines over figure (for other body parts) -->
      <svg
        class="pointer-events-none absolute top-0 left-0 z-2 h-full w-full lg:block"
        :style="{ outline: '1px solid transparent' }"
      >
        <line
          v-for="line in linesCoordinates.filter(
            (l) => !['upper_back', 'lower_back', 'kidneys'].includes(l.bodyPart),
          )"
          :key="line.bodyPart"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          stroke="#A5906F"
          stroke-width="1"
          :style="{ vectorEffect: 'non-scaling-stroke' }"
        />
      </svg>

      <div
        v-if="greaterOrEqualLg"
        class="flex h-full flex-col justify-center"
        :class="[mammothFields?.isMammothAuth ? 'col-span-3' : 'col-span-5']"
      >
        <BaseSpinner v-if="isLoading" class="text-stone size-40 self-center" />

        <div v-else-if="!mammothFields?.isMammothAuth" class="flex max-w-423 flex-col gap-16">
          <div class="rounded-8 flex size-40 items-center justify-center border-[1.5px]">
            <IconBeat />
          </div>

          <p class="text-32 font-secondary">
            {{ $t('startBuildingYourPersonalizedPlan') }}
          </p>

          <BaseButton theme="solid" class="w-fit" @click="isCompleteDetailsWindowShowed = true">
            {{ $t('getStarted') }}
          </BaseButton>
        </div>

        <div
          v-else-if="mammothFields?.isMammothAuth && (!mammoth || mammoth.status === 'pending')"
          class="flex flex-col gap-16"
        >
          <div class="rounded-8 flex size-40 items-center justify-center border-[1.5px]">
            <ClockLottie />
          </div>

          <div class="flex flex-col gap-8">
            <p class="text-32 font-secondary">
              {{ $t('weAreGatheringYourHealthData') }}
            </p>
            <p class="text-14">
              {{ $t('thisMayTakeAFewHoursPleaseCheckBackSoon') }}
            </p>
          </div>
        </div>

        <div v-else-if="!isInsightConditionsDrawerOpened" class="flex flex-col gap-16">
          <div class="rounded-8 flex size-40 items-center justify-center border-[1.5px]">
            <IconSearch />
          </div>

          <p class="text-32 font-secondary">
            {{ $t('clickOnAnyConditionToSeeTheDetails') }}
          </p>
        </div>
      </div>

      <BaseButton
        v-if="!greaterOrEqualLg && activeConditionsCount"
        theme="solid"
        color="light"
        class="col-span-full m-16"
        @click="handleViewAllConditions"
      >
        {{ $t('viewAllConditions') }}
        ({{ activeConditionsCount }})
      </BaseButton>
    </div>

    <InsightConditionsDrawer
      v-if="!isConditionInsightsLoading"
      v-model="isInsightConditionsDrawerOpened"
      :conditionInsights="conditionInsights || []"
      :title="currentBodyPartTitle || ''"
    />

    <CompleteDetailsDrawer v-model="isCompleteDetailsWindowShowed" :fields="mammothFields" />

    <ReactivateTreatmentDrawer
      v-model="isOpenDrawerReactivateTreatment"
      :subscriptions="filteredSubscriptionItems"
      @success="$emit('refreshTreatments')"
    />
  </section>
</template>
