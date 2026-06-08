<script setup lang="ts">
import AllergiesTab from './Tabs/AllergiesTab.vue';
import ConditionsTab from './Tabs/ConditionsTab.vue';
import FamilyHealthTab from './Tabs/FamilyHealthTab.vue';
import ImmunizationTab from './Tabs/ImmunizationTab.vue';
import MedicationsTab from './Tabs/MedicationsTab.vue';
import SocialHistoryTab from './Tabs/SocialHistoryTab.vue';
import TabsModal from './TabsModal.vue';
import BaseTabs from '@/components/BaseTabs/BaseTabs.vue';
import type { BaseTab } from '@/components/BaseTabs/types.ts';
import type { Patient } from '@/types/integration';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  mammothData?: Patient;
  tab?: string;
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');
const { t } = useI18n();

const currentTab = ref<string>(props.tab || 'conditions');
const isTabsModalOpen = ref(false);

const tabs = computed(() => {
  return [
    {
      label: t('conditions'),
      id: 'conditions',
    },
    {
      label: t('medications'),
      id: 'medications',
    },
    {
      label: t('immunization'),
      id: 'immunization',
    },
    {
      label: t('allergies'),
      id: 'allergies',
    },
    {
      label: t('familyHealth'),
      id: 'familyHealth',
    },
    {
      label: t('socialHistory'),
      id: 'socialHistory',
    },
    {
      label: t('more'),
      id: 'more',
    },
  ];
});

const filteredTabs = computed(() => {
  if (greaterOrEqualLg.value) {
    return tabs.value.filter((tab: BaseTab) => tab.id !== 'more');
  }
  return tabs.value.filter((tab: BaseTab) => tab.id === currentTab.value || tab.id === 'more');
});

const tabsWithoutMore = computed(() => {
  return tabs.value.filter((tab: BaseTab) => tab.id !== 'more');
});

const handleClickTab = (tab: string) => {
  currentTab.value = tab;
  isTabsModalOpen.value = false;
};

watch(currentTab, (newValue, oldValue) => {
  if (newValue === 'more') {
    currentTab.value = oldValue;
    isTabsModalOpen.value = true;
  }
});
</script>

<template>
  <TabsModal v-model="isTabsModalOpen" :tabs="tabsWithoutMore" @clickTab="handleClickTab" />

  <div class="flex flex-col" id="medications">
    <BaseTabs v-model="currentTab" :tabs="filteredTabs" theme="tab" class="overflow-x-auto" />

    <ConditionsTab v-if="currentTab === 'conditions'" :data="mammothData?.conditions" />
    <MedicationsTab v-else-if="currentTab === 'medications'" :data="mammothData?.medications" />
    <ImmunizationTab v-else-if="currentTab === 'immunization'" :data="mammothData?.immunization" />
    <AllergiesTab v-else-if="currentTab === 'allergies'" :data="mammothData?.allergies" />
    <FamilyHealthTab
      v-else-if="currentTab === 'familyHealth'"
      :data="mammothData?.familyHistories"
    />
    <SocialHistoryTab
      v-else-if="currentTab === 'socialHistory'"
      :data="mammothData?.socialHistories"
    />
  </div>
</template>
