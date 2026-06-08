<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseTooltip from '@/components/BaseTooltip/BaseTooltip.vue';
import CompleteDetailsDrawer from '@/components/CompleteDetailsDrawer/CompleteDetailsDrawer.vue';
import type { HealthInsightCondition } from '@/types/health.ts';
import type { MammothFields, Patient } from '@/types/integration';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { computed, ref } from 'vue';

const props = defineProps<{
  mammoth?: Patient;
  fields?: MammothFields;
  conditions?: HealthInsightCondition[];
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const isCompleteDetailsWindowShowed = ref(false);
const completeDetailsRef = ref();

const shortConditionsList = computed(() => {
  return props.conditions?.slice(0, 3);
});

const conditionsWithClass = computed(() => {
  return props.conditions?.map((condition: HealthInsightCondition) => ({
    ...condition,
    class: bodyPartHealthClassMap[condition.bodyPart],
  }));
});

const groupedConditions = computed(() => {
  const map = new Map();

  conditionsWithClass.value?.forEach((condition: HealthInsightCondition) => {
    const key = condition.bodyPart;

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key)!.push(condition);
  });

  return Array.from(map.values());
});

const handleCompleteDetailsClick = () => {
  if (props.fields && Object.values(props.fields.filledFields).some((value) => value === false)) {
    isCompleteDetailsWindowShowed.value = true;
  } else {
    completeDetailsRef.value?.handleConfirm();
  }
};

const bodyPartHealthClassMap = {
  head_and_brain: 'top-[4%] left-1/2 -translate-x-1/2',
  throat_and_neck: 'top-[16%] left-1/2 -translate-x-1/2',
  heart: 'top-[24%] left-[54%] -translate-x-1/2',
  lungs: 'top-[24%] left-[46%] -translate-x-1/2',
  breast_and_mammary: 'top-[20%] left-1/2 -translate-x-1/2',
  upper_back: 'top-[27%] left-1/2 -translate-x-1/2',
  lower_back: 'top-[36%] left-1/2 -translate-x-1/2',
  abdomen: 'top-[32%] left-1/2 -translate-x-1/2',
  kidneys: 'top-[34%] left-[54%] -translate-x-1/2',
  pelvis: 'top-[40%] left-1/2 -translate-x-1/2',
  shoulders: 'top-[19%] left-[58%] -translate-x-1/2',
  arms_and_hands: 'top-[35%] left-[63%] -translate-x-1/2',
  hips: 'top-[52%] left-[46%] -translate-x-1/2',
  knees: 'top-[61%] left-[46%] -translate-x-1/2',
  feet_and_ankles: 'top-[85%] left-[46%] -translate-x-1/2',
  general_health: 'top-[10%] left-[15%] -translate-x-1/2',
};
</script>

<template>
  <div
    class="rounded-8 flex flex-col gap-24 bg-white p-16 lg:gap-32 lg:p-24"
    data-testpl="dashboard-conditions"
  >
    <div class="flex flex-col gap-8">
      <h2 class="text-21 lg:text-26 font-secondary" data-testpl="card-header">
        {{ $t('conditionsOverview') }}
      </h2>
      <span
        v-if="mammoth && mammoth.updatedAt && fields?.isMammothAuth"
        class="text-14 text-secondary-text"
      >
        {{ $t('lastUpdatedOn') }} {{ mammoth.updatedAt }}
      </span>
    </div>
    <div class="relative">
      <img
        src="@/assets/images/body-diagram.png"
        :alt="$t('bodyDiagram')"
        draggable="false"
        data-testpl="body-diagram"
        :class="{ 'blur-sm': !fields?.isMammothAuth }"
        class="rounded-4 pointer-events-none aspect-[376/420] w-full"
      />
      <template v-if="greaterOrEqualLg && groupedConditions && fields?.isMammothAuth">
        <div
          v-for="(group, index) in groupedConditions"
          :key="index"
          class="absolute"
          data-testpl="conditions-group"
          :class="group[0].class"
        >
          <BaseTooltip>
            <template #trigger>
              <div
                class="bg-bone hover:bg-bone/50 hover:border-bone size-8 rounded-full hover:size-12 hover:translate-y-2 hover:border hover:border-2"
              />
            </template>
            <template #default>
              <ul>
                <li v-for="(condition, index) in group" :key="index" class="max-w-160">
                  <span v-if="group.length > 1">-</span> {{ condition.title }}
                </li>
              </ul>
            </template>
          </BaseTooltip>
        </div>
      </template>

      <template v-if="!fields?.isMammothAuth">
        <div class="absolute top-0 right-0 bottom-0 left-0 flex flex-col p-24">
          <p class="text-32 lg:text-21 xl:text-32 font-secondary text-white uppercase">
            {{ $t('wantToSeePersonalizedHealthInsights') }}
          </p>
          <p class="text-14 mt-14 text-white">
            {{ $t('toDisplayYourHealthConditionsPleaseCompleteFewMissingDetails') }}
          </p>
          <BaseButton
            class="mt-auto shrink-0"
            color="light"
            data-testpl="complete-details-button"
            @click="handleCompleteDetailsClick"
          >
            {{ $t('completeDetails') }}
          </BaseButton>
        </div>
      </template>
    </div>
    <div v-if="fields?.isMammothAuth" class="flex flex-col gap-16">
      <span class="text-18">{{ $t('activeConditions') }}</span>

      <span v-if="!mammoth" class="text-14">{{ $t('noActiveConditionsToShow') }}</span>

      <div v-else class="flex flex-col gap-16">
        <div
          v-for="(condition, index) in shortConditionsList"
          :key="index"
          data-testpl="condition-item"
          class="flex items-center gap-16"
        >
          <figure class="bg-beige rounded-4 size-64 shrink-0" />
          <div class="flex w-full flex-col gap-8">
            <div class="flex items-center justify-between gap-8">
              <span class="text-21 font-secondary font-medium">
                {{ condition.title }}
              </span>
              <!-- TODO: Currently, this parameter doesn't come from the server. And the widget itself isn't used anywhere. It's commented out for now, just in case. -->
              <!-- <span class="text-beige text-10 uppercase">
                {{ condition.severity }}
              </span> -->
            </div>
            <p class="text-stone text-14">
              {{ condition.shortRecommendation }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <BaseButton
      v-if="fields?.isMammothAuth"
      :to="{ name: 'PatientHealth' }"
      class="mt-6"
      data-testpl="show-more-button"
    >
      {{ $t('showMore') }}
    </BaseButton>

    <CompleteDetailsDrawer
      v-model="isCompleteDetailsWindowShowed"
      :fields
      ref="completeDetailsRef"
    />
  </div>
</template>
