import type { BeRightBackPayload, BeRightBackResponse } from './types';
import { useExternalApi } from '@/composables/useApi';

const getBeRightBack = (payload: BeRightBackPayload) => {
  return useExternalApi<BeRightBackResponse>('https://app.retention.chargebee.com/precancel', {
    redirect: 'follow',
  }).post(payload);
};

export const apiChargebee = {
  getBeRightBack,
};
