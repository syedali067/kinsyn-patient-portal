import type { GetPharmacyPayload } from '@/api/pharmacy/types';
import { useApi } from '@/composables/useApi';
import type { MyPharmacy, Pharmacy } from '@/types/pharmacy.ts';
import type { Response } from '@/types/response';
import { useMemoize } from '@vueuse/core';
import { stringifyQuery } from 'vue-router';

const getPharmacy = useMemoize((payload: GetPharmacyPayload = {}) => {
  const params = stringifyQuery({ ...payload });

  return useApi<Response<Pharmacy>>(`/api/v1/pharmacy?${params}`).get();
});

const getProfilePharmacy = useMemoize(() => {
  return useApi<Response<MyPharmacy>>('/api/v1/profile/my-pharmacy').get();
});

export const apiPharmacy = {
  getPharmacy,
  getProfilePharmacy,
};
