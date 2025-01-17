import type { _AsyncData } from "#app/composables/asyncData";
import type { ApiResponse } from "~/types/response";

interface CacheOptions {
  cacheTime?: number;
  key?: string;
  transform?: (data: any) => any;
}

export const useCachedApi = <T>(
  apiFn: () => Promise<ApiResponse<T>>,
  options: CacheOptions = {}
) => {
  const nuxtApp = useNuxtApp();
  const {
    cacheTime = 1000 * 60 * 60 * 2,
    key = apiFn.name,
    transform,
  } = options;

  const getCachedData = (key: string) => {
    const result = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    if (!result) return null;

    const expiredAt = new Date(result.fetched_at);

    expiredAt.setTime(expiredAt.getTime() + cacheTime);
    const isExpired = expiredAt.getTime() < Date.now();

    return !isExpired ? result : null;
  };

  const { data, pending, error, refresh } = useAsyncData(
    key,
    async () => {
      const response = await apiFn();
      return response;
    },
    {
      transform: (payload) => ({
        ...(transform ? transform(payload) : payload),
        fetched_at: new Date(),
      }),
      getCachedData: (key) => getCachedData(key),
    }
  );

  return {
    data,
    pending,
    error,
    refresh,
  };
};
