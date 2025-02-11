import type { ApiResponse } from "~/types/response";

interface ReturnUseUploadFileService {
  uploadFile: (
    payload: FormData,
    folder: string
  ) => Promise<ApiResponse<UploadFileResponse>>;
  uploadFileSingleLink: (folder: string) => string;
}

export interface UploadFileResponse {
  urls: string;
  identifiers: string;
}

export const useUploadFileService = (): ReturnUseUploadFileService => {
  const { $request } = useNuxtApp();
  const config = useRuntimeConfig();

  const APP_ENV = config.public.NUXT_API_ENV;
  const API_BASE_DEV = config.public.NUXT_PUBLIC_API_BASE_DEV;
  const API_BASE_PROD = config.public.NUXT_PUBLIC_API_BASE_PROD;

  const BASE_URL = APP_ENV === "dev" ? API_BASE_DEV : API_BASE_PROD;

  const uploadFile = async (
    payload: FormData,
    folder: string
  ): Promise<ApiResponse<UploadFileResponse>> => {
    const response = await $request.post<
      FormData,
      ApiResponse<UploadFileResponse>
    >({
      url: `/upload-file/${folder}`,
      body: payload,
    });

    return response;
  };

  const uploadFileSingleLink = (folder: string): string => {
    return BASE_URL + `/upload-file-single/${folder}`;
  };

  return {
    uploadFile,
    uploadFileSingleLink,
  };
};
