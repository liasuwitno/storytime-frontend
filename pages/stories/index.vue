<template>
  <LayoutsMultipleStoryLayout
    page-title="Search Results"
    :heading-title="`${stories.length} Search results for '${searchQuery}'`"
    variant="searching"
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
          No Results Found
        </h3>
        <p class="text-charcoal-gray text-lg font-medium">
          We couldn't find any stories matching "{{ searchQuery }}"
        </p>
        <figure class="text-center mt-7">
          <NuxtImg
            src="/images/no-results-found.svg"
            alt="no-results-illustration"
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
import { useAuthenticationStore } from "~/stores/auth";
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
  type ConfigsParams,
  type StoryResponse,
} from "~/composables/services/useStoryService";

const route = useRoute();
const router = useRouter();

const { toggleOptimisticBookmark, pendingBookmarks, handleBookmarkError } =
  useBookmark();
const { showToast } = useCustomToastify();

if (process.server) {
  const searchQuery = route.query.search;
  if (
    !searchQuery ||
    typeof searchQuery !== "string" ||
    searchQuery.trim() === ""
  ) {
    navigateTo("/", { redirectCode: 302 });
  }
}

const authStore = useAuthenticationStore();

const userProfile = computed(() => authStore.userProfile);
const searchQuery = computed(() => route.query.search);

const formData = reactive({
  search: "",
  sort: "newest",
  per_page: 10,
});

const isLoadingStories = ref<boolean>(false);
const currentPage = ref<number>(1);
const totalPages = ref<number>(1);
const stories = ref<StoryResponse[]>([]);

const { getSpesificStories } = useStoryService();

const getStories = async ({
  sort,
  per_page = 10,
  search,
}: ConfigsParams): Promise<void> => {
  try {
    isLoadingStories.value = true;
    const response = await getSpesificStories("all-story", {
      per_page,
      sort,
      search,
    });

    if (response.code === CODE_OK) {
      const data = response.data;
      stories.value = data?.stories ?? [];
      totalPages.value = data.pagination.total_pages;
    }
  } catch (error) {
    console.error("[SEARCH_STORIES]: ", error);
  } finally {
    isLoadingStories.value = false;
  }
};

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

const changePage = (page: number) => {
  if (page !== currentPage.value) {
    currentPage.value = page;
    getStories({
      search: searchQuery.value as string,
      sort: formData.sort,
      per_page: formData.per_page,
    });
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    getStories({
      search: searchQuery.value as string,
      sort: formData.sort,
      per_page: formData.per_page,
    });
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    getStories({
      search: searchQuery.value as string,
      sort: formData.sort,
      per_page: formData.per_page,
    });
  }
};

const debouncedSearch = useDebounceFn(() => {
  if (formData.search.trim() === "") {
    return navigateTo("/", { redirectCode: 302 });
  }

  router.push({
    path: route.path,
    query: {
      search: formData.search,
      sort: formData.sort,
    },
  });

  getStories({
    search: formData.search,
    sort: formData.sort,
    per_page: formData.per_page,
  });
}, 500);

const handleSearch = () => {
  debouncedSearch();
};

const handleSortChange = (newSort: string) => {
  router.push({
    path: route.path,
    query: {
      search: searchQuery.value,
      sort: newSort,
    },
  });

  getStories({
    search: searchQuery.value as string,
    sort: newSort,
    per_page: formData.per_page,
  });
};

onMounted(() => {
  if (route.query) {
    formData.sort = (route.query.sort as string) || "newest";
    formData.search = (route.query.search as string) || "";
  }

  getStories({
    search: searchQuery.value as string,
    per_page: formData.per_page,
    sort: formData.sort,
  });
});

watch(
  [() => route.query.search, () => route.query.sort],
  ([newSearch, newSort]) => {
    if (newSearch || newSort) {
      formData.search = (newSearch as string) || "";
      formData.sort = (newSort as string) || "newest";

      getStories({
        search: newSearch as string,
        per_page: formData.per_page,
        sort: formData.sort,
      });
    }
  },
  { immediate: true }
);
</script>
