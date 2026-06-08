import type {
  MammothRegistrationPayload,
  MammothRegistrationResponse,
} from '@/api/integrations/mammoth/types.ts';
import { useApi } from '@/composables/useApi.ts';
import type { Patient, MammothFields } from '@/types/integration';
import type { Response } from '@/types/response';
import { useMemoize } from '@vueuse/core';

const getMammothConditions = useMemoize(() => {
  return useApi<Response<Patient | undefined>>(`/api/v3/integration/mammoth/patients/my`).get();
});

const getMammothFields = useMemoize(() => {
  return useApi<Response<MammothFields>>('/api/v3/integration/mammoth/patient/fields').get();
});

const mammothRegistration = (payload: MammothRegistrationPayload) => {
  return useApi<Response<MammothRegistrationResponse>>(
    '/api/v3/integration/mammoth/patient/registration',
  ).post(payload);
};

export const apiIntegrations = {
  getMammothConditions,
  getMammothFields,
  mammothRegistration,
};
