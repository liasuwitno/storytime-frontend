<template>
  <template v-if="isLoading">
    <UiSkeletonCardSkeleton v-for="j in 2" :key="j" variant="list" />
  </template>

  <template v-else-if="hasStories">
    <div v-for="(story, index) in userStories" :key="story.story_id">
      <UiCardItem
        hasCategory
        isPrivateStory
        isMultipleMethod
        variant="list"
        :story="story"
        :url="`/stories/${story.slug}`"
        :enabled-buttons="['delete', 'update']"
        :bookmarked="{
          is_bookmark: story.is_bookmark,
          is_loading: false,
        }"
        :actions="{
          bookmark: () => {},
          delete: () => {},
          update: () => {},
        }"
      />
    </div>

    <div class="col-span-2 flex justify-center mt-8">
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
              <Button
                class="w-10 h-10 p-0"
                :variant="item.value === currentPage ? 'default' : 'outline'"
                @click="changePage(item.value)"
              >
                {{ item.value }}
              </Button>
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

  <template v-else>
    <div
      class="flex items-center justify-center text-center col-span-2 flex-col"
    >
      <h3
        class="font-bold text-raisin-black text-4xl tracking-tight font-mono mb-3"
      >
        No Stories Yet
      </h3>
      <p class="text-charcoal-gray text-lg font-medium">
        You haven't shared any stories yet. Start your fitness journey today!
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
</template>

<script setup lang="ts">
import {
  Pagination,
  PaginationEllipsis,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  useStoryService,
  type StoryPersonalResponse,
} from "~/composables/services/useStoryService";
import { watchEffect, ref, computed } from "vue";

const { getUserStories } = useStoryService();

const currentPage = ref<number>(1);
const totalPages = ref<number>(1);
const perPage = ref<number>(5);
const isLoading = ref<boolean>(false);
const userStoriesMap = ref<Record<number, StoryPersonalResponse["stories"]>>(
  {}
);

const userStories = computed(
  () => userStoriesMap.value[currentPage.value] || []
);

const hasStories = computed(
  () => !isLoading.value && userStories.value.length > 0
);

const fetchUserStories = async (page: number): Promise<void> => {
  if (userStoriesMap.value[page]) {
    console.log(`Cache hit for page ${page}`);
    return;
  }

  try {
    isLoading.value = true;
    const response = await getUserStories({ page, perPage: perPage.value });

    if (response?.code === 200) {
      const data = response.data as StoryPersonalResponse;
      userStoriesMap.value[page] = data.stories ?? [];
      totalPages.value = data.pagination.total_pages;
    } else {
      userStoriesMap.value[page] = [];
    }
  } catch (error) {
    console.error({ error });
    userStoriesMap.value[page] = [];
  } finally {
    isLoading.value = false;
  }
};

watchEffect(() => {
  fetchUserStories(currentPage.value);
});

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
</script>
