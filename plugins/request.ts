interface RequestProps<T> {
  url: string;
  headers?: Record<string, string>;
  body?: T;
}

interface ApiRequest {
  get: <R>(props: RequestProps<null>) => Promise<R>;
  post: <T, R>(props: RequestProps<T>) => Promise<R>;
  put: <T, R>(props: RequestProps<T>) => Promise<R>;
  delete: <R>(props: RequestProps<null>) => Promise<R>;
  patch: <T, R>(props: RequestProps<T>) => Promise<R>;
}

type RequestMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const APP_ENV = config.public.NUXT_APP;
  const API_BASE_DEV = config.public.NUXT_PUBLIC_API_BASE_DEV;
  const API_BASE_PROD = config.public.NUXT_PUBLIC_API_BASE_PROD;

  const BASE_URL = APP_ENV === "dev" ? API_BASE_DEV : API_BASE_PROD;

  const getDefaultHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getCookie("session") ?? ""}`,
  });

  const createRequest = <T, R>(method: RequestMethods) => {
    return async ({ url, headers = {}, body }: RequestProps<T>): Promise<R> => {
      const newUrl = `${BASE_URL}${url}`;

      const response = await $fetch(newUrl, {
        method,
        headers: {
          ...getDefaultHeaders(),
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      return response as R;
    };
  };

  const request: ApiRequest = {
    get: createRequest("GET"),
    post: createRequest("POST"),
    put: createRequest("PUT"),
    delete: createRequest("DELETE"),
    patch: createRequest("PATCH"),
  };

  return {
    provide: {
      request,
    },
  };
});
