<script setup lang="ts">
import BlockComponent from './components/BlockComponent.vue';
import SkeletonComponent from './components/SkeletonComponent.vue';
import { useMammothFields } from '@/composables/useMammothFields';
import { useTerra } from '@/composables/useTerra';
import type { PatientAppointments } from '@/types/health';
import { computed } from 'vue';

const props = defineProps<{
  patientAppointments?: PatientAppointments;
  loading: boolean;
}>();

const { terraEndUser, isTerraLoading } = useTerra();

const { mammothFields, isMammothFieldsLoading } = useMammothFields();

const isLoading = computed(
  () => isMammothFieldsLoading.value || isTerraLoading.value || props.loading,
);
</script>

<template>
  <SkeletonComponent v-if="isLoading" :class="$attrs.class" />
  <BlockComponent
    v-else
    :class="$attrs.class"
    :mammoth-fields="mammothFields"
    :terra="terraEndUser"
    :patient-appointments="patientAppointments"
  />
</template>
