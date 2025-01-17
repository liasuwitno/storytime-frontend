import type { ApiResponse } from "~/types/response";

interface ReturnUseUploadFileService {
  uploadFile: (
    payload: FormData,
    folder: string
  ) => Promise<ApiResponse<UploadFileResponse>>;
}

interface UploadFileResponse {
  url: string;
}

export const useUploadFileService = (): ReturnUseUploadFileService => {
  const { $request } = useNuxtApp();

  const uploadFile = async (
    payload: FormData,
    folder: string
  ): Promise<ApiResponse<UploadFileResponse>> => {
    const response = await $request.post<
      FormData,
      ApiResponse<UploadFileResponse>
    >({
      url: `/upload-file/${folder}`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: payload,
    });

    return response;
  };

  return {
    uploadFile,
  };
};
