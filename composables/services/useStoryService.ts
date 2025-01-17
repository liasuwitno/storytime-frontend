import type { ApiResponse } from "~/types/response";

export interface StoryResponse {
  story_id: number;
  title: string;
  slug: string;
  author: {
    name: string;
    avatar: string;
  };
  images: Array<{
    url: string;
    identifier: string;
  }>;
  content: string;
  created_at: string;
  category_name?: string;
}

export interface StoryPayload {
  title: string;
  body: string;
  images: string[];
  category_id: number;
}

export interface LandingStoryResponse {
  category_id: number;
  category_name: string;
  stories: StoryResponse[];
}

interface ReturnUseStoryService {
  getLandingStories: () => Promise<ApiResponse<LandingStoryResponse[]>>;
  getStory: (slug: string) => Promise<ApiResponse<StoryResponse>>;
  createStory: (payload: StoryPayload) => Promise<ApiResponse<null>>;
  updateStory: (
    payload: StoryPayload,
    storyId: string
  ) => Promise<ApiResponse<null>>;
  deleteStory: (storyId: string) => Promise<ApiResponse<null>>;
}

export const useStoryService = (): ReturnUseStoryService => {
  const { $request } = useNuxtApp();

  const getLandingStories = async (): Promise<
    ApiResponse<LandingStoryResponse[]>
  > => {
    const response = await $request.get<ApiResponse<LandingStoryResponse[]>>({
      url: "/story-categories",
    });

    return response;
  };

  const getStory = async (
    slug: string
  ): Promise<ApiResponse<StoryResponse>> => {
    const response = await $request.get<ApiResponse<StoryResponse>>({
      url: `/story-detail/${slug}`,
    });

    return response;
  };

  const createStory = async (payload: StoryPayload) => {
    const response = await $request.post<StoryPayload, ApiResponse<null>>({
      url: "/create-story",
      body: payload,
    });

    return response;
  };

  const updateStory = async (payload: StoryPayload, storyId: string) => {
    const response = await $request.put<StoryPayload, ApiResponse<null>>({
      url: `/edit-story/${storyId}`,
      body: payload,
    });

    return response;
  };

  const deleteStory = async (storyId: string) => {
    const response = await $request.delete<ApiResponse<null>>({
      url: `/story-delete/${storyId}`,
    });

    return response;
  };

  return {
    getLandingStories,
    getStory,
    createStory,
    updateStory,
    deleteStory,
  };
};
