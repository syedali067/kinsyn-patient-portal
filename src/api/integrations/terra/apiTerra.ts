import type {
  AuthWidgetUrl,
  TerraEndUser,
  TerraUser,
  TerraUserTerraInfoProvider,
} from '@/api/integrations/terra/types';
import { stringifyQuery, useApi } from '@/composables/useApi.ts';
import type { Response } from '@/types/response';
import { useMemoize } from '@vueuse/core';

const getTerraEndUser = useMemoize(() => {
  return useApi<Response<TerraEndUser | null>>(`/api/v3/integration/terra/end-user`, {
    toastOptions: { displayError: false },
  }).get();
});

const syncUser = (terraUserId: TerraUser['terra']['user_id']) => {
  const params = stringifyQuery({ terraUserId });

  return useApi<Response<void>>(`/api/v3/integration/terra/user/sync?${params}`).post();
};

const disconnectUser = (terraUserId: TerraUser['terra']['user_id']) => {
  const params = stringifyQuery({ terraUserId });

  return useApi<Response<void>>(`/api/v3/integration/terra/user/disconnect?${params}`).delete();
};

const connectUrl = (provider: TerraUserTerraInfoProvider) => {
  return useApi<Response<AuthWidgetUrl | null>>(
    `/api/v3/integration/terra/user/connect-url?provider=${provider}`,
  ).get();
};

export const apiTerra = {
  getTerraEndUser,
  syncUser,
  disconnectUser,
  connectUrl,
};
