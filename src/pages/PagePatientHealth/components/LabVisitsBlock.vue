<script setup lang="ts">
import AppointmentDocumentsModal from './AppointmentDocumentsModal.vue';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseTabs from '@/components/BaseTabs/BaseTabs.vue';
import type { PatientAppointmentItem, PatientAppointments } from '@/types/health';
import { downloadFile } from '@/utils/download';
import { format } from 'date-fns-tz';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  patientAppointments?: PatientAppointments;
}>();

const { t } = useI18n();

const currentTab = ref('upcoming');
const currentAppointment = ref<PatientAppointmentItem | null>(null);
const currentTitle = ref('');
const isAppointmentModalOpen = ref(false);

const tabs = computed(() => {
  return [
    {
      label: `${t('upcoming')} (${props.patientAppointments?.upcoming.length || 0})`,
      id: 'upcoming',
    },
    {
      label: `${t('previous')} (${props.patientAppointments?.previous.length || 0})`,
      id: 'previous',
    },
  ];
});

const handleScheduleVisit = () => {
  window.location.href = '/quiz/biomarkers';
};

const handleClickDocuments = (item: PatientAppointmentItem, type: 'requisitions' | 'results') => {
  if (item.documents?.length === 1 && item.documents[0]) {
    downloadFile(item.documents[0].fileUri);
  } else {
    currentTitle.value = type === 'requisitions' ? t('requisitions') : t('results');
    currentAppointment.value = item;
    isAppointmentModalOpen.value = true;
  }
};

watch(isAppointmentModalOpen, (value) => {
  if (!value) {
    currentAppointment.value = null;
    currentTitle.value = '';
  }
});

const hasPreviousDocuments = computed(() => {
  return props.patientAppointments?.previous?.some((item) => item.documents?.length);
});
</script>

<template>
  <div class="rounded-8 col-span-4 flex flex-col justify-between gap-32 bg-white p-24">
    <h2 class="text-21 lg:text-26 font-secondary capitalize">
      {{ $t('labVisits') }}
    </h2>

    <BaseTabs :tabs v-model="currentTab" />

    <template v-if="currentTab === 'upcoming'">
      <template v-if="patientAppointments?.upcoming.length">
        <div
          v-for="(item, index) in patientAppointments?.upcoming"
          :key="index"
          class="flex flex-col gap-6"
        >
          <span class="text-12 text-stone font-medium uppercase"> {{ item.locationName }}</span>
          <div class="text-21 font-secondary flex items-center justify-between gap-10">
            <span>
              {{ format(new Date(item.appointmentStart), 'dd MMM, yyyy') }}
            </span>
            <span class="text-stone">
              {{ format(new Date(item.appointmentStart), 'h:mm a') }}
            </span>
          </div>
          <BaseButton
            v-if="item.documents?.length"
            theme="outline"
            class="mt-10 w-fit"
            @click="handleClickDocuments(item, 'requisitions')"
          >
            {{ $t('seeRequisition') }}
          </BaseButton>
        </div>
      </template>

      <template v-else>
        <template
          v-if="!patientAppointments?.upcoming.length && !patientAppointments?.previous.length"
        >
          <figure class="rounded-8 size-72 overflow-hidden">
            <img src="@/assets/images/lab-visits.jpg" alt="doctor" class="size-full object-cover" />
          </figure>
          <div class="flex flex-col gap-8">
            <span class="text-10 text-beige font-medium uppercase">
              {{ $t('insightsIntoYourBiomarkers') }}
            </span>

            <p class="text-18">
              {{ $t('scheduleYourFirstAnnualLabVisit') }}
            </p>
          </div>

          <BaseButton class="lg:w-fit" @click="handleScheduleVisit">
            {{ $t('scheduleYourFirstVisit') }}
          </BaseButton>
        </template>

        <template
          v-else-if="!patientAppointments?.upcoming.length && patientAppointments?.previous.length"
        >
          <p class="text-14">
            {{ $t('thereAreNoUpcomingAppointmentsReTestYourBiomarkersEveryYear') }}
          </p>

          <BaseButton class="lg:w-fit" @click="handleScheduleVisit">
            {{ $t('scheduleAdditionalTests') }}
          </BaseButton>
        </template>
      </template>
    </template>

    <template v-if="currentTab === 'previous'">
      <template v-if="patientAppointments?.previous.length">
        <div
          v-for="(item, index) in patientAppointments?.previous"
          :key="index"
          class="flex flex-col gap-6"
        >
          <span class="text-12 text-stone font-medium uppercase"> {{ item.locationName }}</span>
          <div class="text-21 font-secondary flex items-center justify-between gap-10">
            <span>
              {{ format(new Date(item.appointmentStart), 'dd MMM, yyyy') }}
            </span>
            <span class="text-stone">
              {{ format(new Date(item.appointmentStart), 'h:mm a') }}
            </span>
          </div>
          <div v-if="item.documents?.length" class="mt-10 flex flex-col gap-8">
            <p v-if="item.documents.length === 1" class="text-14 text-stone">
              {{ $t('resultReceivedDate') }} - {{ item.documents[0]?.date }}
            </p>

            <BaseButton
              theme="outline"
              class="w-fit"
              @click="handleClickDocuments(item, 'results')"
            >
              {{ $t('downloadLabReport') }}
            </BaseButton>
          </div>
        </div>
      </template>
      <template v-else>
        <p class="text-14">
          {{ $t('thereAreNoPreviousTestsReTestYourBiomarkersEveryYear') }}
        </p>
      </template>

      <p v-if="hasPreviousDocuments">
        {{ $t('thisDashboardReflectsSummaryOfYourWellness') }}
      </p>

      <BaseButton class="lg:w-fit" @click="handleScheduleVisit">
        {{ $t('scheduleAdditionalTests') }}
      </BaseButton>
    </template>

    <AppointmentDocumentsModal
      v-model="isAppointmentModalOpen"
      :documents="currentAppointment?.documents"
      :title="currentTitle"
    />
  </div>
</template>
