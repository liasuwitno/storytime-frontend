<template>
  <LayoutsSEOLayout
    title="Connect with global readers and writers in the world"
  >
    <LayoutsCommonLayout container="lg">
      <Hero />

      <template v-if="!isLoadingLatest">
        <section>
          <UiSectionBar
            title="Latest Story"
            redirectLink="/stories/categories/all-story"
            isShowExploreMore
          />

          <StoryModuleLayout
            isSlider
            variant="list"
            :bookmarked="{
              action: handleBookmark,
            }"
            :stories="latestStory"
          />
        </section>
      </template>

      <template v-else>
        <section class="mb-12">
          <div
            class="flex items-center justify-between pb-6 mb-2 border-b border-[#CCCCCC]"
          >
            <UiSkeleton class="w-32 h-8" />
            <UiSkeleton class="w-24 h-6" />
          </div>

          <div class="grid grid-cols-4 gap-4">
            <UiSkeletonCardSkeleton v-for="j in 4" :key="j" variant="list" />
          </div>
        </section>
      </template>

      <template v-if="!isLoading">
        <section v-for="(story, index) in stories" :key="story?.category_name">
          <UiSectionBar
            :title="story?.category_name ?? '-'"
            redirectLink="/"
            :isShowExploreMore="story?.stories?.length > 0"
          />

          <StoryModuleLayout
            v-if="story?.stories?.length > 0"
            :stories="story?.stories"
            :variant="index % 2 !== 1 ? 'grid' : 'list'"
            :bookmarked="{
              action: handleBookmark,
            }"
          />

          <div v-else class="flex items-center justify-center mt-8 py-10">
            <p class="text-base font-medium text-raisin-black">
              No stories found in this {{ story?.category_name ?? "category" }}
            </p>
          </div>
        </section>
      </template>

      <template v-else>
        <section v-for="i in 3" :key="i" class="mb-12">
          <div
            class="flex items-center justify-between pb-6 mb-2 border-b border-[#CCCCCC]"
          >
            <UiSkeleton class="w-32 h-8" />
            <UiSkeleton class="w-24 h-6" />
          </div>
          <div class="grid grid-cols-3 gap-4">
            <UiSkeletonCardSkeleton v-for="j in 3" :key="j" variant="grid" />
          </div>
        </section>
      </template>

      <section>
        <UiSectionBar title="More Categories" />
        <div class="relative flex items-center flex-wrap gap-4 mt-8">
          <NuxtLink
            v-for="category in categories"
            :key="category.id"
            :to="`/stories/categories/${String(category.name).toLowerCase()}`"
            class="bg-[#F0F5ED] px-8 py-7 rounded-md hover:bg-[#F0F5ED]/50"
          >
            <p class="text-[#466543] font-medium text-base tracking-tight">
              {{ category?.name ?? "-" }}
            </p>
          </NuxtLink>
        </div>
      </section>
    </LayoutsCommonLayout>
  </LayoutsSEOLayout>
</template>

<script setup lang="ts">
import {
  useCategoryService,
  type CategoriesResponse,
} from "~/composables/services/useCategoryService";
import {
  useStoryService,
  type LandingStoryResponse,
  type StoryResponse,
} from "~/composables/services/useStoryService";
import { useBookmarkStore } from "~/stores/bookmark";

const bookmarkStore = useBookmarkStore();

const ACTIVE_CATEGORIES = ["Comedy", "Romance", "Horror"];
const STORIES_PER_CATEGORY = 3;

const isLoading = ref<boolean>(false);
const isLoadingLatest = ref<boolean>(false);

const latestStory = ref<StoryResponse[]>([]);
const stories = ref<LandingStoryResponse[]>([]);
const categories = ref<CategoriesResponse[]>([]);

const { getLandingStories, getLatestStories } = useStoryService();
const { getCategories: getAllCategories } = useCategoryService();

const { toggleOptimisticBookmark, pendingBookmarks, handleBookmarkError } =
  useBookmark();

const handleBookmark = async (story: StoryResponse) => {
  try {
    pendingBookmarks.value.add(story.story_id);
    toggleOptimisticBookmark(story);
  } catch (error) {
    console.error("[BOOKMARK_ERROR]:", error);
    handleBookmarkError(story.story_id);
  } finally {
    pendingBookmarks.value.delete(story.story_id);
  }
};

const getStories = async (): Promise<void> => {
  try {
    isLoading.value = true;
    const response = await getLandingStories();

    if (response?.code === CODE_OK) {
      const storiesData = response.data as LandingStoryResponse[];

      const initializeBookmarks = storiesData
        ?.flatMap((story) => {
          return story.stories?.flatMap((childStory) => {
            if (childStory.is_bookmark) {
              return {
                story_id: childStory.story_id,
                user_id: childStory.author.user_id,
                is_bookmark: childStory.is_bookmark,
              };
            }

            return [];
          });
        })
        ?.filter((bookmark) => bookmark.is_bookmark);

      bookmarkStore.initializeBookmarks(initializeBookmarks);

      stories.value = storiesData
        ?.filter((story) => ACTIVE_CATEGORIES.includes(story.category_name))
        ?.map((story) => ({
          ...story,
          stories: story.stories?.slice(0, STORIES_PER_CATEGORY),
        }));
    }
  } catch (error) {
    console.error("[STORIES]: ", error);
  } finally {
    isLoading.value = false;
  }
};

const getLatest = async (): Promise<void> => {
  try {
    isLoadingLatest.value = true;
    const response = await getLatestStories();

    if (response?.code === CODE_OK) {
      const storiesData = response.data as StoryResponse[];

      const initializeBookmarks = storiesData
        .map((story) => ({
          story_id: story.story_id,
          user_id: story.author.user_id,
          is_bookmark: story.is_bookmark,
        }))
        ?.filter((bookmark) => bookmark.is_bookmark);

      bookmarkStore.initializeBookmarks(initializeBookmarks);

      latestStory.value = storiesData;
    }
  } catch (error) {
    console.error("[LATEST]: ", error);
  } finally {
    isLoadingLatest.value = false;
  }
};

const getCategories = async (): Promise<void> => {
  try {
    if (categories.value.length > 0) return;

    const response = await getAllCategories();

    if (response?.code === CODE_OK) {
      categories.value = response.data
        ?.map((category) => ({
          id: category.id,
          name: category.name,
        }))
        ?.filter((category) => !ACTIVE_CATEGORIES.includes(category.name));
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const executeActions = async (): Promise<void> => {
  try {
    await getLatest();

    await Promise.all([getStories(), getCategories()]);
  } catch (error) {
    console.error("[EXECUTE_ACTIONS]: ", error);
  }
};

onMounted(() => {
  executeActions();
});
</script>

<style scoped>
.content-section {
  @apply mb-12;
}

.section-header {
  @apply flex items-center justify-between pb-6 mb-2 border-b border-[#CCCCCC];
}
</style>
