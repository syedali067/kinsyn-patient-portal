<script setup lang="ts">
import ItemCardsList from './ItemCardsList.vue';
import type { TerraEndUser } from '@/api/integrations/terra/types.ts';
import IconBeat from '@/assets/icons/beat.svg?component';
import IconChat from '@/assets/icons/chat.svg?component';
import IconDeviceEmpty from '@/assets/icons/device-empty.svg?component';
import IconDna from '@/assets/icons/dna.svg?component';
import IconLabTest from '@/assets/icons/lab-test.svg?component';
import bgBiomarkerSubscription from '@/assets/images/complete-your-health/bg-biomarker-subscription.jpg';
import bgCompleteYourHealth from '@/assets/images/complete-your-health/bg-complete-your-health.jpg';
import bgConnectHealth from '@/assets/images/complete-your-health/bg-connect-health.jpg';
import bgHealthSurvey from '@/assets/images/complete-your-health/bg-health-survey.jpg';
import bgOrderAddons from '@/assets/images/complete-your-health/bg-order-addons.jpg';
import bgWearable from '@/assets/images/complete-your-health/connect-wearable.jpg';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import CompleteDetailsDrawer from '@/components/CompleteDetailsDrawer/CompleteDetailsDrawer.vue';
import ModalConnectDevices from '@/components/ModalConnectDevices/ModalConnectDevices.vue';
import { useConnectDevice } from '@/composables/useConnectDevice';
import { useTerra } from '@/composables/useTerra';
import { useUserStore } from '@/stores/user';
import type { PatientAppointments } from '@/types/health';
import type { MammothFields } from '@/types/integration';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { ref, watch, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

type ContentType =
  | 'main'
  | 'connectYourHealthData'
  | 'takeAShortHealthSurvey'
  | 'addBiomarkerSubscription'
  | 'connectYourWearable'
  | 'orderAddonsTests';

const props = defineProps<{
  mammothFields?: MammothFields;
  terra?: TerraEndUser | null;
  patientAppointments?: PatientAppointments;
}>();

const { t } = useI18n();
const userStore = useUserStore();
const { isLoading, connectUrl, disconnectDevice, modalConnectDevicesShow, devices } =
  useConnectDevice(props.terra);
const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const { isTerraLoading } = useTerra();

const progress = ref(0);
const stagesCompleted = ref<string[]>([]);
const isCompleteDetailsWindowShowed = ref(false);
const activeContentKey = ref('main');
const expandedItems = ref<Set<string>>(new Set());

const isCompletedWeightManagementQuiz = computed(() => {
  return userStore.profile?.completedSubmissions.includes('weight-management');
});

const isCompletedLabsQuiz = computed(() => {
  return (
    userStore.profile?.completedSubmissions.includes('labs') ||
    props.patientAppointments?.upcoming.length ||
    props.patientAppointments?.previous.length
  );
});

const handleItemToggle = (id: string) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id);
  } else {
    expandedItems.value.clear();
    expandedItems.value.add(id);
  }
};

watch(
  () => stagesCompleted.value.length,
  (value) => {
    progress.value = value * 25;
  },
);

onMounted(() => {
  if (props.mammothFields?.isMammothAuth) {
    stagesCompleted.value.push('connectYourHealthData');
  }
  if (props.terra?.terraUsers.length) {
    stagesCompleted.value.push('connectYourWearable');
  }
  if (isCompletedWeightManagementQuiz.value) {
    stagesCompleted.value.push('takeAShortHealthSurvey');
  }
  if (isCompletedLabsQuiz.value) {
    stagesCompleted.value.push('addBiomarkerSubscription');
  }
});

const content = computed(() => {
  return {
    main: {
      title: t('buildYourFullHealthProfile'),
      description: t('completeEachStepToUncover'),
      image: bgCompleteYourHealth,
      id: 'main',
      icon: '',
      completeText: '',
      buttonFunc: () => {},
    },
    connectYourHealthData: {
      title: t('theKeyToYourPersonalizedHealthProfile'),
      description: t('connectYourHealthDataToReceiveContinuous'),
      image: bgConnectHealth,
      buttonTitle: t('connectYourHealthData'),
      buttonFunc: () => (isCompleteDetailsWindowShowed.value = true),
      id: 'connectYourHealthData',
      icon: IconBeat,
      completeText: t('connected'),
    },
    takeAShortHealthSurvey: {
      title: t('understandYourLifestyleAndGoals'),
      description: t('answerAFewQuickQuestionsSoOurAITailorInsights'),
      image: bgHealthSurvey,
      buttonTitle: t('startSurvey'),
      buttonFunc: () => {
        window.location.href = '/quiz/introduction';
      },
      id: 'takeAShortHealthSurvey',
      icon: IconChat,
      completeText: t('completed'),
    },
    addBiomarkerSubscription: {
      title: t('unlockThePowerOfBiomarkerAnalysis'),
      description: t('subscribeForMonthlyBiomarkerTracking'),
      image: bgBiomarkerSubscription,
      buttonTitle: t('subscribe'),
      buttonFunc: () => {
        window.location.href = '/quiz/labs';
      },
      id: 'addBiomarkerSubscription',
      icon: IconDna,
      completeText: t('completed'),
    },
    connectYourWearable: {
      title: t('syncYourDevicesForRealTimeInsights'),
      description: t('connectYourWearableToUnlockRealTime'),
      image: bgWearable,
      buttonTitle: t('syncYourDevice'),
      buttonFunc: () => {
        modalConnectDevicesShow.value = true;
      },
      id: 'connectYourWearable',
      icon: IconDeviceEmpty,
      completeText: t('connected'),
      loading: isTerraLoading.value,
    },
    orderAddonsTests: {
      title: t('addExtraTestsThatGiveYouDeeperInsights'),
      description: t('addTargetedTestsToExploreHormones'),
      image: bgOrderAddons,
      buttonTitle: t('chooseFrom20PlusTests'),
      buttonFunc: () => {
        window.location.href = '/quiz/biomarkers';
      },
      id: 'orderAddonsTests',
      icon: IconLabTest,
      completeText: t('completed'),
    },
  };
});

const activeContent = computed(() => {
  return content.value?.[activeContentKey.value as ContentType];
});
</script>

<template>
  <div class="flex flex-col gap-16" @mouseleave="activeContentKey = 'main'">
    <section class="lg:rounded-8 row gap-16 bg-white px-16 py-24 lg:gap-24">
      <div class="col-span-full flex flex-col gap-16 lg:col-span-4">
        <h2 class="text-26 font-secondary">{{ $t('completeYourHealthProfile') }}</h2>

        <span class="text-96 font-secondary shrink-0">{{ progress }}%</span>

        <div class="relative w-full">
          <div class="rounded-4 absolute top-4 right-0 left-0 h-16 lg:right-8 lg:left-6">
            <div
              class="rounded-4 bg-beige h-full transition-all duration-300"
              :style="{ width: `${progress}%` }"
            />
          </div>
          <div class="flex w-full justify-between">
            <div class="flex flex-col items-center gap-4">
              <div class="border-sand h-24 w-1 border-l border-dashed" />
              <span v-if="greaterOrEqualLg" class="text-10">00</span>
            </div>
            <div class="flex flex-col items-center gap-4">
              <div class="border-sand h-24 w-1 border-l border-dashed" />
              <span v-if="greaterOrEqualLg" class="text-10">20</span>
            </div>
            <div class="flex flex-col items-center gap-4">
              <div class="border-sand h-24 w-1 border-l border-dashed" />
              <span v-if="greaterOrEqualLg" class="text-10">40</span>
            </div>
            <div class="flex flex-col items-center gap-4">
              <div class="border-sand h-24 w-1 border-l border-dashed" />
              <span v-if="greaterOrEqualLg" class="text-10">60</span>
            </div>
            <div class="flex flex-col items-center gap-4">
              <div class="border-sand h-24 w-1 border-l border-dashed" />
              <span v-if="greaterOrEqualLg" class="text-10">80</span>
            </div>
            <div class="flex flex-col items-center gap-4">
              <div class="border-sand h-24 w-1 border-l border-dashed" />
              <span v-if="greaterOrEqualLg" class="text-10">100</span>
            </div>
          </div>
        </div>

        <ItemCardsList
          :content
          :stages-completed
          :expanded-items
          @mouseenter="
            (id: string) => {
              activeContentKey = id;
            }
          "
          @click="(item) => item.buttonFunc?.()"
          @toggle="handleItemToggle"
        />
      </div>

      <div
        v-if="greaterOrEqualLg"
        class="rounded-8 relative flex h-full min-h-656 items-center gap-24 overflow-hidden pl-64 lg:col-span-8"
      >
        <div :key="activeContentKey" class="z-10 flex w-320 flex-col gap-16 text-white">
          <h3 class="text-32 font-secondary">{{ activeContent.title }}</h3>
          <p class="text-14">
            {{ activeContent.description }}
          </p>
          <BaseButton
            v-if="'buttonTitle' in activeContent && 'buttonFunc' in activeContent"
            class="w-fit"
            color="light"
            @click="activeContent.buttonFunc?.()"
          >
            {{ activeContent.buttonTitle }}
          </BaseButton>
        </div>
        <div class="absolute top-0 right-0 h-full w-full">
          <Transition
            enter-active-class="transition-opacity duration-500 ease-out"
            leave-active-class="transition-opacity duration-500 ease-in"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <img
              :key="activeContentKey"
              :src="activeContent.image"
              :alt="activeContent.title"
              class="absolute top-0 right-0 size-full object-cover"
            />
          </Transition>
        </div>
      </div>
    </section>

    <CompleteDetailsDrawer
      v-model="isCompleteDetailsWindowShowed"
      :fields="mammothFields"
      @complete="stagesCompleted.push('connectYourHealthData')"
    />

    <ModalConnectDevices
      v-model="modalConnectDevicesShow"
      :devices
      :loading="isLoading"
      @connect="connectUrl"
      @disconnect="disconnectDevice"
    />
  </div>
</template>
