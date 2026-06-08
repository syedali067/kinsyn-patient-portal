import type { ZendeskToken } from '@/api/integrations/zendesk/types';
import { useApi } from '@/composables/useApi';
import type { Response } from '@/types/response';

const getToken = () => {
  return useApi<Response<ZendeskToken>>('/api/v3/integration/zendesk/token', {
    toastOptions: { displayError: false },
  }).get();
};

export const apiZendesk = {
  getToken,
};
