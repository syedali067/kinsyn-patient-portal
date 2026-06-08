import type {
  GetTreatmentsPayload,
  ModifyTreatmentPayload,
  ReactivateTreatmentPayload,
  RemoveAddonPayload,
  RetentionKey,
} from './types';
import { useApi } from '@/composables/useApi';
import type { Response } from '@/types/response';
import type { Treatment } from '@/types/treatment';
import { useMemoize } from '@vueuse/core';

const getTreatments = useMemoize((payload: GetTreatmentsPayload) => {
  return useApi<Response<Treatment[]>>(
    `/api/v1/treatments-v2?patientId=${payload.patientId}`,
  ).get();
});

const modifyTreatment = (payload: ModifyTreatmentPayload) => {
  return useApi<Response<[]>>(`/api/v1/treatments/${payload.treatmentId}/modify-request`).put(
    payload,
  );
};

const cancelTreatment = (treatmentId: Treatment['id']) => {
  return useApi<Response<[]>>(`/api/v1/treatments/${treatmentId}/cancel-v2`).put();
};

const getRetentionKey = (treatmentId: Treatment['id']) => {
  return useApi<Response<RetentionKey>>(
    `/api/v1/retention/get-key?treatmentId=${treatmentId}`,
  ).get();
};

const removeAddon = (payload: RemoveAddonPayload) => {
  return useApi<Response<Treatment>>(`/api/v1/treatments/${payload.treatmentId}/remove-addon`).put(
    payload,
  );
};

const reActivateTreatment = (payload: ReactivateTreatmentPayload) => {
  return useApi<Response<[]>>(`/api/v1/treatments/${payload.treatmentId}/resume`).post({
    subscriptionItemIdsToRemove: payload.subscriptionItemIdsToRemove,
  });
};

const approveMembership = (payload: ReactivateTreatmentPayload) => {
  return useApi<Response<[]>>(`/api/v2/treatments/${payload.treatmentId}/approve-membership`).post({
    subscriptionItemIdsToRemove: payload.subscriptionItemIdsToRemove,
  });
};

export const apiTreatment = {
  getTreatments,
  modifyTreatment,
  getRetentionKey,
  cancelTreatment,
  removeAddon,
  reActivateTreatment,
  approveMembership,
};
