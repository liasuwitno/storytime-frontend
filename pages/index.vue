<template>
  <LayoutsCommonLayout container="lg">
    <Hero />

    <template v-if="!isLoading">
      <section>
        <UiSectionBar
          title="Latest Story"
          redirectLink="/stories"
          isShowExploreMore
        />
        <StoryModuleLayout :stories="latestStory" variant="list" isSlider />
      </section>

      <section v-for="(story, index) in stories" :key="story?.category_name">
        <UiSectionBar
          :title="story?.category_name ?? '-'"
          redirectLink="/"
          :isShowExploreMore="story?.stories?.length > 0"
        />

        <StoryModuleLayout
          v-if="story?.stories?.length > 0"
          :stories="story?.stories"
          variant="grid"
        />

        <div v-else class="flex items-center justify-center mt-8 py-10">
          <p class="text-base font-medium text-raisin-black">
            No stories found in this {{ story?.category_name ?? "category" }}
          </p>
        </div>
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
          :to="`/`"
          class="bg-[#F0F5ED] px-8 py-7 rounded-md hover:bg-[#F0F5ED]/50"
        >
          <p class="text-[#466543] font-medium text-base tracking-tight">
            {{ category?.name ?? "-" }}
          </p>
        </NuxtLink>
      </div>
    </section>
  </LayoutsCommonLayout>
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

const ACTIVE_CATEGORIES = ["Comedy", "Romance", "Horror"];
const STORIES_PER_CATEGORY = 3;

const latestStory = ref<StoryResponse[]>([]);
const stories = ref<LandingStoryResponse[]>([]);
const categories = ref<CategoriesResponse[]>([]);
const isLoading = ref<boolean>(false);

const { getLandingStories } = useStoryService();
const { getCategories: getAllCategories } = useCategoryService();

const getStories = async (): Promise<void> => {
  try {
    isLoading.value = true;
    const response = await getLandingStories();

    if (response?.code === CODE_OK) {
      const storiesData = response.data as LandingStoryResponse[];

      stories.value = storiesData
        ?.filter((story) => ACTIVE_CATEGORIES.includes(story.category_name))
        ?.map((story) => ({
          ...story,
          stories: story.stories?.slice(0, STORIES_PER_CATEGORY),
        }));

      latestStory.value = storiesData
        ?.flatMap((story) =>
          story.stories
            ? story.stories.map((childStory) => ({
                ...childStory,
                category_name: story.category_name,
              }))
            : []
        )
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ) as StoryResponse[];
    }
  } catch (error) {
    console.error("Error fetching stories:", error);
  } finally {
    isLoading.value = false;
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

onMounted(async () => {
  if (!stories.value?.length && !categories.value?.length) {
    await Promise.all([getStories(), getCategories()]);
  }
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
