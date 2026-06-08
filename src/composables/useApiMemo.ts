import type { Response } from '@/types/response.ts';
import { useMemoize, type UseFetchReturn, type UseMemoizeReturn } from '@vueuse/core';

/**
 * This composable is a wrapper around useMemoize that allows you to update the cache of the API call.
 * @param resolver - The function that returns the result of the API call.
 * @returns The result of the API call.
 */
export const useApiMemo = <T, Args extends unknown[]>(
  resolver: (...args: Args) => Result<T>,
): UpdatedUseMemoizeReturn<T, Args> => {
  const useMemoizeReturn = useMemoize(resolver);

  return Object.assign(useMemoizeReturn, {
    updateCache(data: T, ...args: Args) {
      const key = useMemoizeReturn.generateKey(...args);
      const cachedResponse = useMemoizeReturn.cache.get(key);

      if (!cachedResponse?.data.value) {
        throw new Error(`Cached response not found with key: ${key}`);
      }

      cachedResponse.data.value.data = data;
      useMemoizeReturn.cache.set(key, cachedResponse);
    },
  });
};

interface UpdatedUseMemoizeReturn<T, Args extends unknown[]>
  extends UseMemoizeReturn<Result<T>, Args> {
  updateCache: (data: T, ...args: Args) => void;
}

type Result<T> = UseFetchReturn<Response<T>> & PromiseLike<UseFetchReturn<Response<T>>>;
