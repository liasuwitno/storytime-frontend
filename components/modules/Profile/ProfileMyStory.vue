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
        :url="`/stories/detail/${story.slug}`"
        :enabled-buttons="['delete', 'update']"
        :bookmarked="{
          is_bookmark: false,
          is_loading: false,
        }"
        :actions="{
          update: () => handleOpenEditStory(story.slug),
          delete: () => handleOpenDeleteDialog(story),
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

    <UiDialog
      :open="!!selectedStory"
      @update:open="handleDialogChange"
      class="overflow-y-auto"
    >
      <UiDialogContent
        class="sm:max-w-[400px]"
        :class="{ 'overflow-visible': !!selectedStory }"
      >
        <UiDialogHeader>
          <UiDialogTitle
            :class="cn('font-semibold text-3xl text-center', 'mb-1')"
          >
            Delete Story
          </UiDialogTitle>
          <UiDialogDescription :class="cn('text-center text-base font-medium')">
            Are you sure you want to delete
            <span class="font-semibold text-raisin-black"
              >"{{ selectedStory?.title }}"</span
            >? This action cannot be undone.
          </UiDialogDescription>
        </UiDialogHeader>

        <UiDialogFooter class="mx-auto space-x-2 mt-4">
          <UiDialogClose asChild>
            <UiButton
              type="button"
              variant="outline"
              size="lg"
              :disabled="isLoadingDelete"
              :class="
                cn(
                  'text-olive-drab border-olive-drab border-2 text-base',
                  'hover:text-white hover:bg-olive-drab'
                )
              "
            >
              Cancel
            </UiButton>
          </UiDialogClose>

          <UiButton
            type="button"
            variant="default"
            size="lg"
            @click="handleDeleteStory"
            :disabled="isLoadingDelete"
            :class="cn('bg-olive-drab text-base', 'hover:bg-olive-drab/90')"
          >
            <LoaderCircle
              v-if="isLoadingDelete"
              :size="16"
              :stroke-width="3"
              :class="cn({ 'animate-spin': isLoadingDelete })"
            />

            {{ isLoadingDelete ? "Deleting..." : "Delete" }}
          </UiButton>
        </UiDialogFooter>
      </UiDialogContent>
    </UiDialog>
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
import {
  useStoryService,
  type StoryPersonalResponse,
  type StoryResponse,
} from "~/composables/services/useStoryService";

const { getUserStories, deleteStory } = useStoryService();
const { showToast } = useCustomToastify();

const isLoadingDelete = ref<boolean>(false);
const selectedStory = ref<StoryResponse | null>(null);

const handleOpenEditStory = (slug: string) => {
  navigateTo(`/profile/story/${slug}/edit`);
};

const handleOpenDeleteDialog = (story: StoryResponse | null) => {
  selectedStory.value = story;
};

const handleDialogChange = (isOpen: boolean) => {
  if (!isOpen) {
    selectedStory.value = null;
  }
};

const handleDeleteStory = async () => {
  if (!selectedStory.value) return;

  try {
    isLoadingDelete.value = true;

    const response = await deleteStory(selectedStory.value.story_id);

    if (response.code === 200) {
      if (userStoriesMap.value[currentPage.value]) {
        userStoriesMap.value[currentPage.value] = userStoriesMap.value[
          currentPage.value
        ].filter((story) => story.story_id !== selectedStory.value?.story_id);
      }

      if (userStoriesMap.value[currentPage.value].length === 0) {
        if (currentPage.value > 1) {
          currentPage.value--;
        }

        totalPages.value = Math.max(1, totalPages.value - 1);
      }

      const currentCache = { ...userStoriesMap.value };
      Object.keys(currentCache).forEach((page) => {
        if (Number(page) > currentPage.value) {
          delete userStoriesMap.value[Number(page)];
        }
      });

      showToast("✅ Story deleted successfully", {
        autoClose: 3000,
        position: "top-center",
      });

      selectedStory.value = null;
    } else {
      showToast("❌ Story deleted failed", {
        autoClose: 3000,
        position: "top-center",
      });
    }

    isLoadingDelete.value = false;
  } catch (error) {
    console.error("[STORY DELETE]:", error);
    isLoadingDelete.value = false;
  }
};

const currentPage = ref<number>(1);
const totalPages = ref<number>(1);
const perPage = ref<number>(4);
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
