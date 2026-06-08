<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseTabs from '@/components/BaseTabs/BaseTabs.vue';
import SubscriptionItem from '@/pages/PagePatientDashboard/components/SubscriptionItem.vue';
import type { ModifiedSubscriptionItem } from '@/types/subscription.ts';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  supplements: ModifiedSubscriptionItem[];
  medications: ModifiedSubscriptionItem[];
}>();

const { t } = useI18n();

const tabs = computed(() => {
  return [
    {
      label: `${t('medications')} (${props.medications?.length})`,
      id: 'medications',
    },
    {
      label: `${t('supplements')} (${props.supplements?.length})`,
      id: 'supplements',
    },
  ];
});

const currentTab = ref<'medications' | 'supplements'>('supplements');

watch(
  () => props.medications,
  (medications) => {
    currentTab.value = medications.length ? 'medications' : 'supplements';
  },
  { immediate: true },
);

const itemsToShow = computed(() => {
  if (currentTab.value === 'medications') {
    return props.medications;
  }
  return props.supplements;
});

const stringIfNotData = computed(() => {
  if (!props.medications.length && !props.supplements.length) {
    return `${t('noOngoing')} ${t('treatments')}.`;
  } else {
    return currentTab.value === 'medications'
      ? `${t('noOngoing')} ${t('medications')}.`
      : `${t('noOngoing')} ${t('supplements')}.`;
  }
});

const isShowMedicalHistoryButton = computed(() => {
  return (
    (currentTab.value === 'medications' && !props.medications.length && props.supplements.length) ||
    (currentTab.value === 'supplements' && !props.supplements.length && props.medications.length)
  );
});
</script>

<template>
  <div
    class="rounded-8 flex flex-col gap-24 bg-white p-16 lg:gap-32 lg:p-24"
    data-testpl="dashboard-treatment"
  >
    <h2 class="text-21 lg:text-26 font-secondary flex flex-col" data-testpl="card-header">
      <span>{{ $t('ongoingMedications') }}</span>
      <span class="lowercase">& {{ $t('supplements') }}</span>
    </h2>

    <BaseTabs
      v-if="medications.length || supplements.length"
      :tabs
      v-model="currentTab"
      data-testpl="card-tabs"
    />

    <div v-if="itemsToShow?.length" class="flex flex-col gap-32">
      <div
        v-for="item in itemsToShow.slice(0, 3)"
        :key="item.id"
        class="flex items-center justify-between gap-12"
      >
        <SubscriptionItem :subscription="item" />
      </div>
    </div>

    <div v-else class="text-14 lowercase first-letter:uppercase">
      {{ stringIfNotData }}
    </div>

    <template v-if="medications.length || supplements.length">
      <BaseButton
        v-if="itemsToShow.length > 3 && !isShowMedicalHistoryButton"
        class="w-full"
        :to="{ name: 'PatientTreatments' }"
        data-testpl="card-item-link"
      >
        {{ $t('showAll') }}
      </BaseButton>
      <BaseButton
        v-if="isShowMedicalHistoryButton"
        class="w-full"
        :to="{ name: 'PatientHealth', hash: '#medications' }"
        data-testpl="card-item-link"
      >
        {{ $t('showMedicalHistory') }}
      </BaseButton>
    </template>
  </div>
</template>
