import { apiUser } from '@/api/user';
import router from '@/router';
import { useToastStore } from '@/stores/toast';
import type {
  ApiOptionsWithToasts,
  ExternalApiOptions,
  QueryValue,
  RequestInitWithToastsOptions,
} from '@/types/api';
import { createFetch } from '@vueuse/core';

const useApiRaw = createFetch({
  combination: 'chain',
  options: {
    async beforeFetch({ options }) {
      const sessionInfoResponse = apiUser.getSessionInfo();

      options.credentials = 'include';
      options.headers = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': sessionInfoResponse.data.value?.data.csrfTokenValue ?? '',
        ...options.headers,
      };

      return { options };
    },

    async onFetchError(ctx) {
      const toastStore = useToastStore();

      const { response, data, error, context } = ctx;
      const options = context.options as RequestInitWithToastsOptions | undefined;
      const toastOptions = options?.toastOptions;

      let message = '';

      if (!response) {
        message = 'Please check your internet connection and try again.';
      }

      if (response?.status === 401 || response?.status === 403) {
        await apiUser.getSessionInfo.load();
        await router.push({ name: 'Login' });
      }

      if (response?.status && response.status >= 500) {
        message = 'Internal error';
      }

      message = data?.message || data?.data?.message || error?.message || message;

      toastStore.addToast({
        type: 'error',
        text: message,
        ...toastOptions,
      });

      return ctx;
    },
  },
});

const useExternalApiRaw = createFetch({
  combination: 'chain',
  options: {
    async beforeFetch({ options }) {
      options.credentials = 'include';
      options.headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      return { options };
    },

    onFetchError(ctx) {
      return ctx;
    },
  },
});

const useApi = <T>(url: string, obj?: ApiOptionsWithToasts) => useApiRaw(url, obj ?? {}).json<T>();

const useApiBlob = (url: string, obj?: ApiOptionsWithToasts) => useApiRaw(url, obj ?? {}).blob();

const useExternalApi = <T>(url: string, obj?: ExternalApiOptions) =>
  useExternalApiRaw(url, obj ?? {}).json<T>();

const stringifyQuery = <T extends Record<string, QueryValue>>(payload: T): string => {
  const params = new URLSearchParams();

  const processValue = (key: string, value: QueryValue): void => {
    if (value === null || value === undefined) return;

    if (value instanceof Date) {
      params.append(key, value.toISOString());
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined) {
          params.append(`${key}[]`, String(item));
        }
      });
    } else if (typeof value === 'object') {
      params.append(key, JSON.stringify(value));
    } else {
      params.append(key, String(value));
    }
  };

  (Object.entries(payload) as [string, QueryValue][]).forEach(([key, value]) => {
    processValue(key, value);
  });

  return params.toString();
};

export { stringifyQuery, useApi, useApiBlob, useExternalApi };
