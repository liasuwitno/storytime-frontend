<template>
  <LayoutsMultipleStoryLayout
    :page-title="changeToNormalText(params.category as string, 'trainCase')"
    :heading-title="changeToNormalText(params.category as string, 'trainCase')"
    :params="{
      category: changeToNormalText(params.category as string, 'trainCase'),
    }"
    variant="category"
  >
    <div :class="cn('grid grid-cols-1 gap-4', 'md:grid-cols-[2fr_1fr]')">
      <div class="flex items-center space-x-3 w-full">
        <div class="flex items-center space-x-2">
          <UiLabel :class="cn('text-quartz font-medium text-sm')">
            Sort By
          </UiLabel>
          <UiSelect
            v-model="formData.sort"
            @update:model-value="handleSortChange"
          >
            <UiSelectTrigger class="w-[180px] border-none">
              <UiSelectValue
                :class="cn('font-semibold')"
                placeholder="Select an option"
              />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectGroup :class="cn('font-semibold')">
                <UiSelectItem
                  v-for="(sort, index) in SORT_OPTIONS"
                  :key="index"
                  :class="cn('font-semibold')"
                  :value="sort.value"
                >
                  {{ sort?.label ?? "" }}
                </UiSelectItem>
              </UiSelectGroup>
            </UiSelectContent>
          </UiSelect>
        </div>

        <div class="flex items-center space-x-2">
          <UiLabel :class="cn('text-quartz font-medium text-sm')">
            Category
          </UiLabel>
          <UiSelect
            v-model="formData.category"
            @update:model-value="handleCategoryChange"
          >
            <UiSelectTrigger class="w-[180px] border-none">
              <UiSelectValue
                :class="cn('font-semibold')"
                placeholder="Select an option"
              />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectGroup :class="cn('font-semibold')">
                <UiSelectItem
                  v-for="(category, index) in categories"
                  :key="index"
                  :class="cn('font-semibold')"
                  :value="category.name?.toLowerCase()"
                  :disabled="isLoading"
                  @click="navigateToCategory(category.name?.toLowerCase())"
                >
                  {{ category?.name ?? "" }}
                </UiSelectItem>
              </UiSelectGroup>
            </UiSelectContent>
          </UiSelect>
        </div>
      </div>

      <div class="block">
        <UiInput
          type="text"
          placeholder="Search Story"
          :inputClass="cn('py-5 px-4 font-medium text-sm')"
          :iconRight="Search"
          v-model="formData.search"
          @input="handleSearch"
        />
      </div>
    </div>

    <template v-if="isLoadingStories">
      <section v-for="i in 3" :key="i" class="mt-5 mb-12">
        <div class="grid grid-cols-3 gap-4">
          <UiSkeletonCardSkeleton v-for="j in 3" :key="j" variant="grid" />
        </div>
      </section>
    </template>

    <template v-else-if="!stories || stories.length === 0">
      <div
        :class="
          cn(
            'flex items-center justify-center text-center col-span-2 flex-col',
            'mt-8'
          )
        "
      >
        <h3
          class="font-bold text-raisin-black text-4xl tracking-tight font-mono mb-3"
        >
          No Stories Yet
        </h3>
        <p class="text-charcoal-gray text-lg font-medium">
          It looks like there are no stories for this search
        </p>
        <figure class="text-center mt-7">
          <NuxtImg
            src="/images/no-stories-yet.svg"
            alt="no-stories-illustration"
            class="h-80 w-auto inline-block"
          />
        </figure>
      </div>
    </template>

    <template v-else>
      <StoryModuleLayout
        variant="list"
        :is-show-category="true"
        :stories="stories"
        :bookmarked="{
          action: handleBookmark,
        }"
      />

      <div class="flex justify-center mt-8">
        <Pagination
          :total="totalPages"
          :sibling-count="1"
          show-edges
          :items-per-page="1"
          :default-page="currentPage"
        >
          <PaginationList v-slot="{ items }" class="flex items-center gap-1">
            <PaginationPrev @click="prevPage" :disabled="currentPage === 1" />

            <template v-for="(item, index) in items">
              <PaginationListItem
                v-if="item.type === 'page'"
                :key="index"
                :value="item.value"
                as-child
              >
                <UiButton
                  class="w-10 h-10 p-0"
                  :variant="item.value === currentPage ? 'default' : 'outline'"
                  @click="changePage(item.value)"
                >
                  {{ item.value }}
                </UiButton>
              </PaginationListItem>
              <PaginationEllipsis v-else />
            </template>

            <PaginationNext
              @click="nextPage"
              :disabled="currentPage === totalPages"
            />
          </PaginationList>
        </Pagination>
      </div>
    </template>
  </LayoutsMultipleStoryLayout>
</template>

<script setup lang="ts">
import { Search } from "lucide-vue-next";
import { useDebounceFn } from "@vueuse/core";

import {
  Pagination,
  PaginationEllipsis,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from "@/components/ui/pagination";

import {
  useCategoryService,
  type CategoriesResponse,
} from "~/composables/services/useCategoryService";

import {
  useStoryService,
  type ConfigsParams,
  type StoryResponse,
} from "~/composables/services/useStoryService";

import { useAuthenticationStore } from "~/stores/auth";
import { useBookmarkStore } from "~/stores/bookmark";

const route = useRoute();
const router = useRouter();

const bookmarkStore = useBookmarkStore();
const authStore = useAuthenticationStore();

const formData = reactive({
  search: "",
  sort: "newest",
  category: "",
  per_page: 10,
});

const isLoading = ref<boolean>(false);
const isLoadingStories = ref<boolean>(false);

const currentPage = ref<number>(1);
const totalPages = ref<number>(1);
const perPage = ref<number>(10);

const stories = ref<StoryResponse[]>([]);
const categories = ref<CategoriesResponse[]>([]);

const { getSpesificStories } = useStoryService();
const { getCategories: getAllCategories } = useCategoryService();

const { toggleOptimisticBookmark, pendingBookmarks, handleBookmarkError } =
  useBookmark();
const { showToast } = useCustomToastify();

const userProfile = computed(() => authStore.userProfile);

const params = computed(() => route.params).value as Record<string, string>;

const handleBookmark = async (story: StoryResponse) => {
  if (!userProfile.value) {
    showToast("❌ You must be logged in to bookmark stories", {
      autoClose: 2500,
      position: "top-center",
      redirectPath: "/login",
    });

    return;
  }

  try {
    pendingBookmarks.value.add(story.story_id);
    toggleOptimisticBookmark(story, userProfile.value?.id);
  } catch (error) {
    console.error("[BOOKMARK_ERROR]:", error);
    handleBookmarkError(story.story_id);
  } finally {
    pendingBookmarks.value.delete(story.story_id);
  }
};

const getCategories = async (): Promise<void> => {
  try {
    isLoading.value = true;
    const response = await getAllCategories();

    if (response?.code === CODE_OK) {
      const rebuildData = response.data?.map((category) => ({
        id: category.id,
        name: category.name,
      }));

      categories.value = [
        {
          id: 0,
          name: "All Story",
        },
        ...rebuildData,
      ];
    }
  } catch (error) {
    console.error("[GET_CATEGORIES]: ", error);
  } finally {
    isLoading.value = false;
  }
};

const getStories = async ({
  sort,
  per_page = 10,
  search,
  category,
}: ConfigsParams & { category: string }): Promise<void> => {
  try {
    isLoadingStories.value = true;
    const response = await getSpesificStories(category, {
      per_page,
      sort,
      search,
    });

    if (response.code === CODE_OK) {
      const data = response.data;

      const initializeBookmarks = data.stories
        .map((story) => ({
          story_id: story.story_id,
          user_id: story.author.user_id,
          is_bookmark: story.is_bookmark,
        }))
        ?.filter((bookmark) => bookmark.is_bookmark);

      bookmarkStore.initializeBookmarks(initializeBookmarks);

      stories.value = data?.stories ?? [];
      totalPages.value = data.pagination.total_pages;
    }
  } catch (error) {
    console.error("[GET_STORIES]: ", error);
  } finally {
    isLoadingStories.value = false;
  }
};

const changePage = (page: number) => {
  if (page !== currentPage.value) {
    currentPage.value = page;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const navigateToCategory = (categoryName: string) => {
  const query: Record<string, string | undefined> = {
    sort: formData.sort,
  };

  if (formData.search.trim() !== "") {
    query.search = formData.search;
  }

  if (categoryName.toLowerCase() === "all story") {
    return router.push({
      path: `/stories/categories/all-story`,
      query,
    });
  }

  router.push({
    path: `/stories/categories/${categoryName.toLowerCase()}`,
    query,
  });
};

const debouncedSearch = useDebounceFn(() => {
  const query: Record<string, string | undefined> = {
    sort: formData.sort,
  };

  if (formData.search.trim() !== "") {
    query.search = formData.search;
  }

  router.push({
    path: route.path,
    query,
  });
}, 500);

const handleSearch = () => {
  debouncedSearch();
};

const handleSortChange = (newSort: string) => {
  const query: Record<string, string | undefined> = {
    sort: newSort,
  };

  if (formData.search.trim() !== "") {
    query.search = formData.search;
  }

  router.push({
    path: route.path,
    query,
  });
};

const handleCategoryChange = (newCategory: string) => {
  navigateToCategory(newCategory);
};

onMounted(() => {
  formData.category = changeToNormalText(
    params.category as string,
    "trainCase"
  );

  if (route.query) {
    formData.sort = (route.query.sort as string) || "newest";
    formData.search = (route.query.search as string) || "";
  }

  if (!categories.value.length) {
    getCategories();
  }
});

watch(
  [() => route.params.category, () => route.query],
  ([newCategory, newQuery]) => {
    if (newCategory) {
      formData.category = changeToNormalText(
        newCategory as string,
        "trainCase"
      );

      formData.sort = (newQuery.sort as string) || "newest";

      if (newQuery.search && formData.search.trim() === "") {
        router.push({
          path: route.path,
          query: {
            sort: formData.sort,
          },
        });
      }

      getStories({
        category: newCategory as string,
        per_page: formData.per_page,
        sort: formData.sort,
        search: formData.search,
      });
    }
  },
  { immediate: true }
);
</script>
