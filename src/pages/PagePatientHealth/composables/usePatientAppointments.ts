import { apiHealth } from '@/api/health/apiHealth';
import { computedAsync } from '@vueuse/core';
import { computed, ref } from 'vue';

export const usePatientAppointments = () => {
  const isPatientAppointmentsLoading = ref(false);
  const patientAppointmentsResponse = computedAsync(
    () => apiHealth.getPatientAppointments(),
    null,
    isPatientAppointmentsLoading,
  );

  const patientAppointments = computed(() => {
    return patientAppointmentsResponse.value?.data.value?.data;
  });

  return {
    patientAppointments,
    isPatientAppointmentsLoading,
  };
};
