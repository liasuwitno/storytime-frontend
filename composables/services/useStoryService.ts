import type { ApiResponse } from "~/types/response";

export interface StoryResponse {
  id: number;
  unique_id: string;
  title: string;
  slug: string;
  body: string;
  is_deleted: number;
  user_id: number;
  category_id: number;
  created_at: string;
  user: {
    id: number;
    fullname: string;
    avatar: string | null;
  };
  images: Array<{
    id: number;
    url: string;
    related_unique_id: string;
    identifier: string;
  }>;
  category: {
    id: number;
    name: string;
  };
}

export interface StoryResponseDetail {
  story: StoryResponse;
  similar_stories: any[];
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
  getStoryBySlug: (slug: string) => Promise<ApiResponse<StoryResponseDetail>>;
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

  const getStoryBySlug = async (
    slug: string
  ): Promise<ApiResponse<StoryResponseDetail>> => {
    const response = await $request.get<ApiResponse<StoryResponseDetail>>({
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
    getStoryBySlug,
    createStory,
    updateStory,
    deleteStory,
  };
};
