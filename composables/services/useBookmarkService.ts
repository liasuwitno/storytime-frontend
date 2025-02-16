import type { ApiResponse } from "~/types/response";

interface ReturnUseBookmarkService {
  getBookmarkList: () => Promise<ApiResponse<BookmarkListResponse[]>>;
  addBookmark: (payload: BookmarkPayload) => Promise<ApiResponse<null>>
}

export interface BookmarkListResponse {}

export interface BookmarkPayload {
  user_id: string;
  story_id: string;
}

export const useBookmarkService = (): ReturnUseBookmarkService => {
  const { $request } = useNuxtApp();

  const getBookmarkList = async (): Promise<
    ApiResponse<BookmarkListResponse[]>
  > => {
    const response = await $request.get<ApiResponse<BookmarkListResponse[]>>({
      url: "/bookmark-all",
    });

    return response;
  };

  const addBookmark = async (payload: BookmarkPayload) => {
    const response = await $request.post<BookmarkPayload, ApiResponse<null>>({
      url: "/bookmark",
      body: payload,
    });

    return response;
  };

  return {
    getBookmarkList,
    addBookmark
  };
};
