import type { ApiResponse } from "~/types/response";

export interface CategoriesResponse {
  id: number;
  category_name: string;
}

interface ReturnUseStoryService {
  getCategories: () => Promise<ApiResponse<CategoriesResponse[]>>;
}

export const useCategoryService = (): ReturnUseStoryService => {
  const { $request } = useNuxtApp();

  const getCategories = async (): Promise<
    ApiResponse<CategoriesResponse[]>
  > => {
    const response = await $request.get<ApiResponse<CategoriesResponse[]>>({
      url: "/categories-all",
    });

    return response;
  };

  return {
    getCategories,
  };
};
