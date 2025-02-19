<template>
  <template v-if="isLoading">
    <UiSkeletonCardSkeleton v-for="j in 2" :key="j" variant="list" />
  </template>

  <template v-else-if="hasBookmarks">
    <div v-for="(story, index) in userBookmarks" :key="story.story_id">
      <UiCardItem
        hasCategory
        isPrivateStory
        isMultipleMethod
        variant="list"
        :story="story"
        :url="`/stories/detail/${story.slug}`"
        :enabled-buttons="['bookmark']"
        :bookmarked="{
          is_bookmark: bookmarkStore.isBookmarked(story.story_id),
          is_loading: bookmarkStore.isLoading(story.story_id),
        }"
        :actions="{
          bookmark: () => handleBookmark(story),
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
        No Bookmarks Yet
      </h3>
      <p class="text-charcoal-gray text-lg font-medium">
        You haven't saved any bookmarks yet. Explore and bookmark your top
        workouts!
      </p>
      <figure class="text-center mt-7">
        <NuxtImg
          src="/images/no-bookmark-yet.svg"
          alt="no-stories-bookmark"
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
  type StoryBookmarkResponse,
  type StoryResponse,
} from "~/composables/services/useStoryService";
import { useBookmarkStore } from "~/stores/bookmark";
import { useAuthenticationStore } from "~/stores/auth";

const bookmarkStore = useBookmarkStore();
const authStore = useAuthenticationStore();

const { getUserBookmarks } = useStoryService();
const { toggleOptimisticBookmark, pendingBookmarks, handleBookmarkError } =
  useBookmark();

const currentPage = ref<number>(1);
const totalPages = ref<number>(1);
const perPage = ref<number>(5);
const isLoading = ref<boolean>(false);
const userBookmarkMap = ref<Record<number, StoryBookmarkResponse["bookmarks"]>>(
  {}
);

const userProfile = computed(() => authStore.userProfile);

const userBookmarks = computed(
  () => userBookmarkMap.value[currentPage.value] || []
);

const hasBookmarks = computed(() => {
  return (
    !isLoading.value &&
    userBookmarks.value.length > 0 &&
    Object.keys(userBookmarkMap.value).length > 0
  );
});

const handleBookmark = async (story: StoryResponse) => {
  if (!userProfile.value) return;

  try {
    pendingBookmarks.value.add(story.story_id);
    const isCurrentlyBookmarked = bookmarkStore.isBookmarked(story.story_id);

    if (isCurrentlyBookmarked) {
      userBookmarkMap.value[currentPage.value] = userBookmarkMap.value[
        currentPage.value
      ].filter((bookmark) => bookmark.story_id !== story.story_id);
    }

    toggleOptimisticBookmark(story, userProfile.value?.id);

    if (
      userBookmarkMap.value[currentPage.value].length === 0 &&
      currentPage.value > 1
    ) {
      currentPage.value--;
      await fetchUserBookmarks(currentPage.value);
    }
  } catch (error) {
    console.error("[BOOKMARK_ERROR]:", error);
    handleBookmarkError(story.story_id);

    await fetchUserBookmarks(currentPage.value);
  } finally {
    pendingBookmarks.value.delete(story.story_id);
  }
};

const fetchUserBookmarks = async (page: number): Promise<void> => {
  if (userBookmarkMap.value[page]) {
    return;
  }

  try {
    isLoading.value = true;
    const response = await getUserBookmarks({ page, perPage: perPage.value });

    if (response?.code === 200) {
      const data = response.data as StoryBookmarkResponse;
      userBookmarkMap.value[page] = data.bookmarks ?? [];

      const initializeBookmarks = data.bookmarks
        .map((story) => ({
          story_id: story.story_id,
          user_id: story.author.user_id,
          is_bookmark: story.is_bookmark,
        }))
        ?.filter((bookmark) => bookmark.is_bookmark);

      bookmarkStore.initializeBookmarks(initializeBookmarks);

      totalPages.value = data.pagination.total_pages;
    } else {
      userBookmarkMap.value[page] = [];
    }
  } catch (error) {
    console.error({ error });
    userBookmarkMap.value[page] = [];
  } finally {
    isLoading.value = false;
  }
};

watchEffect(() => {
  fetchUserBookmarks(currentPage.value);
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
