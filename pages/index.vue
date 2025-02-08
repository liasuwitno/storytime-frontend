<template>
  <LayoutsCommonLayout container="lg">
    <Hero />

    <div v-if="!isLoading">
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
          :variant="index % 2 ? 'grid' : 'list'"
        />

        <div v-else class="flex items center justify-center mt-8 py-10">
          <p class="text-base font-medium text-raisin-black">
            No stories found in this {{ story?.category_name ?? "category" }}
          </p>
        </div>
      </section>
    </div>

    <div v-else>
      <div class="flex items-center justify-center py-10">Loading...</div>
    </div>

    <section>
      <UiSectionBar title="More Categories" />
      <div class="relative flex items-center space-x-4 flex-wrap mt-8">
        <NuxtLink
          :key="category.id"
          v-for="category in categories"
          :to="`/`"
          :class="
            cn('bg-[#F0F5ED] px-8 py-7 rounded-md', 'hover:bg-[#F0F5ED]/50')
          "
        >
          <p :class="cn('text-[#466543] font-medium text-base tracking-tight')">
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
import { useAuthenticationStore } from "~/stores/auth";

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

      stories.value = storiesData;
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

      isLoading.value = false;
    }

    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.error({ error });
  }
};

const getCategories = async (): Promise<void> => {
  try {
    isLoading.value = true;

    const response = await getAllCategories();

    if (response?.code === CODE_OK) {
      const categoriesData = response.data;

      categories.value = categoriesData?.map((category) => ({
        id: category.id,
        name: category.name,
      }));
    }

    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.error({ error });
  }
};

onMounted(async () => {
  await getStories();
  await nextTick();
  await getCategories();
});
</script>
