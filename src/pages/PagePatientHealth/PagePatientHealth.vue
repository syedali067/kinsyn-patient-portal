<script setup lang="ts">
// import AppointmentsBlock from './components/AppointmentsBlock.vue';
import BiologicalAgeBlock from './components/BiologicalAgeBlock.vue';
import BiomarkersBlock from './components/BiomarkersBlock.vue';
// import CarePlansBlock from './components/CarePlansBlock.vue';
import CategoriesBlock from './components/CategoriesBlock.vue';
import ClockLottie from './components/ClockLottie.vue';
import CompleteYourHealthProfile from './components/CompleteYourHealthProfile/CompleteYourHealthProfile.vue';
// import InsuranceBlock from './components/InsuranceBlock.vue';
import IntroductionBlock from './components/IntroductionBlock.vue';
import LabResultsBlock from './components/LabResultsBlock.vue';
import LabVisitsBlock from './components/LabVisitsBlock.vue';
import PersonalizedInsightsBlock from './components/PersonalizedInsightsBlock';
import ProceduresBlock from './components/ProceduresBlock.vue';
import ProductRecommendationsBlock from './components/ProductRecommendationsBlock/ProductRecommendationsBlock.vue';
// TODO: it was decided to hide this block until the logic on the backend is implemented and a layout with a search state appears
// import SearchBlock from './components/SearchBlock.vue';
import TabsBlock from './components/TabsBlock.vue';
import UnlockYourPersonalWellness from './components/UnlockYourPersonalWellness.vue';
import { usePatientAppointments } from './composables/usePatientAppointments';
import { apiHealth } from '@/api/health/apiHealth';
import { apiIntegrations } from '@/api/integrations/mammoth/apiIntegrations';
import { apiTreatment } from '@/api/treatment';
import IconBeat from '@/assets/icons/beat.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseTabs from '@/components/BaseTabs/BaseTabs.vue';
import CompleteDetailsDrawer from '@/components/CompleteDetailsDrawer/CompleteDetailsDrawer.vue';
import InsightsBlock from '@/components/InsightsBlock/InsightsBlock.vue';
import PoweredBy from '@/components/PoweredBy/PoweredBy.vue';
import WidgetVitals from '@/components/WidgetVitals/WidgetVitals.vue';
import { useAiSettings } from '@/composables/useAiSettings';
import { useBiomarkers } from '@/composables/useBiomarkers';
import { useMammothConditions } from '@/composables/useMammothConditions';
import { useMammothFields } from '@/composables/useMammothFields';
import { usePostHog } from '@/composables/usePostHog';
import { useTreatments } from '@/composables/useTreatments';
import { useTrueDiagnostics } from '@/composables/useTrueDiagnostics';
import { useUserStore } from '@/stores/user';
import { waitTransition } from '@/utils/pageTransition';
import { scrollToHash } from '@/utils/scroll';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { capitalize } from 'lodash-es';
import { ref, computed, onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const userStore = useUserStore();
const { t } = useI18n();
const route = useRoute();

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const { mammothData } = useMammothConditions();
const { questBiomarkers } = useBiomarkers();
const { trueDiagnostics } = useTrueDiagnostics();
const { mammothFields } = useMammothFields();
const { aiSettingsEnabled, getAiSettings } = useAiSettings();
const { treatmentCounter } = useTreatments();
const { patientAppointments, isPatientAppointmentsLoading } = usePatientAppointments();
const { posthog } = usePostHog();
const {
  hasActiveMembership,
  hasDeactivatedMembership,
  subscriptionItemsNotFiltered,
  refreshTreatments,
} = useTreatments();

posthog.onFeatureFlags(() => {
  if (posthog.isFeatureEnabled('patient-portal-ai-settings')) {
    getAiSettings();
  }
});

await Promise.all([
  waitTransition(),
  apiIntegrations.getMammothConditions(),
  apiHealth.getBiologicalAge(),
  apiTreatment.getTreatments({ patientId: userStore.userId as number }),
]);

const isCompleteDetailsWindowShowed = ref(false);

const tabFromRoute = computed(() => route.hash.slice(1) as string);

const biomarkersWithAddons = computed(() => {
  return {
    summary: {
      improving:
        (questBiomarkers.value?.summary?.improving || 0) +
        (trueDiagnostics.value?.summary?.improving || 0),
      outOfRange:
        (questBiomarkers.value?.summary?.outOfRange || 0) +
        (trueDiagnostics.value?.summary?.outOfRange || 0),
      inRange:
        (questBiomarkers.value?.summary?.inRange || 0) +
        (trueDiagnostics.value?.summary?.inRange || 0),
      description:
        questBiomarkers.value?.summary?.description ||
        trueDiagnostics.value?.summary?.description ||
        '',
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

onMounted(() => {
  scrollToHash({ behavior: 'smooth' });
});

const currentTab = ref('overview');
const currentBiomarkersTab = reactive({
  id: 'all',
  label: t('all'),
});

const tabs = computed(() => [
  {
    id: 'overview',
    label: capitalize(t('overview')),
  },
  {
    id: 'lab-tests',
    label: capitalize(t('labTests')),
  },
]);

const handleBiomarkersFilter = (value: string) => {
  currentBiomarkersTab.id = '';
  currentBiomarkersTab.label = '';
  currentBiomarkersTab.id = value;
  currentBiomarkersTab.label = t(value);
};
</script>

<template>
  <div class="row" data-page-in="fadeInUp" data-page-out="fadeOutUp">
    <UnlockYourPersonalWellness
      v-if="!hasActiveMembership && !hasDeactivatedMembership"
      class="col-span-full"
    />
    <template v-else>
      <PersonalizedInsightsBlock
        v-if="aiSettingsEnabled"
        :mammoth="mammothData"
        :has-deactivated-membership
        :subscription-items="subscriptionItemsNotFiltered"
        @refresh-treatments="refreshTreatments"
        class="col-span-full"
      />
      <ProductRecommendationsBlock v-if="aiSettingsEnabled" class="col-span-full" />
      <PoweredBy v-if="!greaterOrEqualLg" class="col-span-full mb-40" />
      <CompleteYourHealthProfile
        :patient-appointments="patientAppointments"
        :loading="isPatientAppointmentsLoading"
        class="col-span-full -mx-16 mb-40 lg:mx-0"
      />

      <div class="col-span-full mb-24 flex flex-col gap-40">
        <h1 class="text-40 font-secondary">
          {{ $t('myHealth') }}
        </h1>

        <BaseTabs :tabs v-model="currentTab" theme="underline-text" />
      </div>

      <div
        v-show="currentTab === 'overview'"
        class="col-span-full flex flex-col gap-24 lg:col-span-8"
      >
        <!--      TODO: it was decided to hide this block until the logic on the backend is implemented and a layout with a search state appears-->
        <!--      <SearchBlock v-if="!greaterOrEqualLg" />-->
        <div
          v-if="!mammothFields?.isMammothAuth"
          class="rounded-8 flex h-304 items-center bg-white p-24"
        >
          <div class="flex max-w-423 flex-col gap-16 lg:ml-152">
            <div class="rounded-8 flex size-40 items-center justify-center border-[1.5px]">
              <IconBeat />
            </div>

            <p class="text-24 font-secondary">
              {{ $t('startBuildingYourPersonalizedPlan') }}
            </p>

            <BaseButton
              theme="outline"
              class="w-fit"
              data-testpl="start-building-your-personalized-plan-button"
              @click="isCompleteDetailsWindowShowed = true"
            >
              {{ $t('getStarted') }}
            </BaseButton>
          </div>
        </div>

        <div
          v-else-if="
            mammothFields?.isMammothAuth && (!mammothData || mammothData.status === 'pending')
          "
          class="rounded-8 flex h-280 items-center bg-white p-24"
        >
          <div class="flex flex-col gap-16 lg:ml-112">
            <div class="rounded-8 flex size-40 items-center justify-center border-[1.5px]">
              <ClockLottie />
            </div>

            <div class="flex flex-col gap-4">
              <p class="text-24 font-secondary">
                {{ $t('weAreGatheringYourHealthData') }}
              </p>
              <p class="text-12">
                {{ $t('thisMayTakeAFewHoursPleaseCheckBackSoon') }}
              </p>
            </div>
          </div>
        </div>

        <TabsBlock v-else :mammoth-data :tab="tabFromRoute" />

        <LabResultsBlock v-if="mammothData?.labResultGroups?.length" :mammoth-data />

        <ProceduresBlock
          v-if="mammothData?.procedures?.length"
          :procedures="mammothData?.procedures"
        />

        <!-- TODO: Commented out for now as part of final updates for Kinsyn -->
        <!-- <CarePlansBlock v-if="mammothData?.carePlans?.length" :mammoth-data />

      <InsuranceBlock
        v-if="mammothData?.insuranceProviders?.length"
        :insurance="mammothData?.insuranceProviders"
      /> -->
      </div>

      <div v-show="currentTab === 'overview'" class="col-span-4 mt-24 flex flex-col gap-24 lg:mt-0">
        <!--      TODO: it was decided to hide this block until the logic on the backend is implemented and a layout with a search state appears-->
        <!--      <SearchBlock v-if="greaterOrEqualLg" />-->

        <!-- TODO: Commented out for now as part of final updates for Kinsyn -->
        <!-- <AppointmentsBlock
        v-if="mammothData?.encounters?.length"
        :appointments="mammothData?.encounters"
      /> -->

        <LabVisitsBlock :patient-appointments="patientAppointments" />

        <WidgetVitals />

        <IntroductionBlock v-if="treatmentCounter" :treatment-category-counter="treatmentCounter" />
      </div>

      <div v-show="currentTab === 'lab-tests'" class="lg:row col-span-full flex flex-col gap-24">
        <template v-if="greaterOrEqualLg">
          <div class="col-span-full mt-24 flex flex-col gap-24 lg:col-span-4 lg:mt-0">
            <BiologicalAgeBlock />
            <BiomarkersBlock
              :summary="biomarkersWithAddons?.summary"
              @filter="handleBiomarkersFilter"
            />
            <LabVisitsBlock :patient-appointments="patientAppointments" />
          </div>
          <div class="col-span-full flex flex-col gap-24 lg:col-span-8">
            <InsightsBlock
              v-if="biomarkersWithAddons?.summary.insights && aiSettingsEnabled"
              :title="$t('biomarkerInsights')"
              :date="biomarkersWithAddons?.summary.createdAt"
              :text="biomarkersWithAddons?.summary.insights"
            />
            <CategoriesBlock
              :categories="biomarkersWithAddons?.categories"
              :tab="currentTab"
              :filter="currentBiomarkersTab"
            />
          </div>
        </template>
        <template v-else>
          <BiomarkersBlock
            :summary="biomarkersWithAddons?.summary"
            @filter="handleBiomarkersFilter"
          />
          <CategoriesBlock
            :categories="biomarkersWithAddons?.categories"
            :tab="currentTab"
            :filter="currentBiomarkersTab"
          />
          <InsightsBlock
            v-if="biomarkersWithAddons?.summary.insights && aiSettingsEnabled"
            :title="$t('biomarkerInsights')"
            :date="biomarkersWithAddons?.summary.createdAt"
            :text="biomarkersWithAddons?.summary.insights"
          />
          <BiologicalAgeBlock />
          <LabVisitsBlock :patient-appointments="patientAppointments" />
        </template>
      </div>

      <CompleteDetailsDrawer v-model="isCompleteDetailsWindowShowed" :fields="mammothFields" />
    </template>
  </div>
</template>
