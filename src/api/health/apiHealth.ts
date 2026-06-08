import type { HealthInsightResponse, BiomarkersResponse } from './types.ts';
import { useApi } from '@/composables/useApi.ts';
import type {
  BodyPart,
  HealthInsightCondition,
  RecommendedProduct,
  PatientAppointments,
  BiologicalAge,
} from '@/types/health.ts';
import type { Response } from '@/types/response.ts';
import { useMemoize } from '@vueuse/core';

const getHealthInsights = useMemoize(() => {
  return useApi<Response<HealthInsightResponse>>(`/api/v3/patient/health-insights`).get();
});

const getHealthConditionInsights = (bodyPart: BodyPart) => {
  return useApi<Response<HealthInsightCondition[]>>(
    `/api/v3/patient/health-insights/conditions/${bodyPart}`,
  ).get();
};

const getProductRecommendations = useMemoize(() => {
  return useApi<Response<RecommendedProduct[]>>(
    `/api/v3/patient/health-insights/recommended-products`,
  ).get();
});

const getPatientAppointments = useMemoize(() => {
  return useApi<Response<PatientAppointments>>('/api/v3/integration/quest/appointments').get();
});

// Quest
const getQuestBiomarkers = useMemoize(() => {
  return useApi<Response<BiomarkersResponse>>('/api/v3/patient/quest-biomarkers').get();
});

// True Diagnostics
const getTrueDiagnosticBiomarkers = useMemoize(() => {
  return useApi<Response<BiomarkersResponse>>(`/api/v3/patient/tru-diagnostic-biomarkers`).get();
});

const getBiologicalAge = useMemoize(() => {
  return useApi<Response<BiologicalAge>>(`/api/v3/tru-diagnostic/biological-age`).get();
});

export const apiHealth = {
  getHealthInsights,
  getHealthConditionInsights,
  getQuestBiomarkers,
  getProductRecommendations,
  getPatientAppointments,
  getTrueDiagnosticBiomarkers,
  getBiologicalAge,
};
