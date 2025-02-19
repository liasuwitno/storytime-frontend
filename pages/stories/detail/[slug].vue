<template>
  <LayoutsSEOLayout :title="currentTitle">
    <div :class="cn('pt-14')">
      <div :class="cn('bg-[#F0F5ED] mb-14')">
        <UiBreadcrumb :class="cn('max-w-7xl mx-auto font-semibold py-7')">
          <UiBreadcrumbList>
            <UiBreadcrumbItem>
              <NuxtLink
                :class="
                  cn('text-asparagus text-base', 'hover:text-asparagus/80')
                "
                href="/"
              >
                Home
              </NuxtLink>
            </UiBreadcrumbItem>
            <UiBreadcrumbSeparator />
            <UiBreadcrumbItem>
              <NuxtLink
                :class="
                  cn(
                    'text-asparagus text-base capitalize',
                    'hover:text-asparagus/80'
                  )
                "
                :href="`/stories/${params.slug}`"
              >
                {{ changeToNormalText(params.slug as string, "trainCase") }}
              </NuxtLink>
            </UiBreadcrumbItem>
          </UiBreadcrumbList>
        </UiBreadcrumb>
      </div>

      <LayoutsCommonLayout container="lg">
        <section class="block">
          <ModulesStoryDetailHeader
            :users="storyDetail?.story?.author"
            :createdAt="storyDetail?.story?.created_at ?? ''"
            :title="storyDetail?.story?.title ?? ''"
          />
        </section>

        <section
          v-if="storyDetail"
          :class="
            cn(
              'mt-10 grid grid-cols-1 gap-4',
              'md:grid-cols-3',
              'lg:mt-14 lg:gap-6'
            )
          "
        >
          <div class="col-span-1 content-images">
            <div class="grid grid-cols-3 gap-4">
              <div
                v-for="(image, index) in images"
                :key="index"
                :class="[
                  'rounded-md overflow-hidden cursor-pointer',
                  'relative',
                  {
                    'col-span-3': index === 0,
                    'col-span-1': index !== 0,
                  },
                ]"
              >
                <div
                  v-if="index === 0"
                  :class="
                    cn(
                      'flex items-center justify-between w-full px-2',
                      'absolute bottom-0 top-0'
                    )
                  "
                >
                  <button
                    type="button"
                    @click.stop="handlePrevious"
                    :disabled="isFirstSlide"
                    :class="
                      cn('hover:bg-white/20 rounded-full p-2 transition-all', {
                        'opacity-50 cursor-not-allowed': isFirstSlide,
                      })
                    "
                  >
                    <ChevronLeft :size="36" stroke="#fff" stroke-width="3" />
                  </button>
                  <button
                    type="button"
                    @click.stop="handleNext"
                    :disabled="isLastSlide"
                    :class="
                      cn('hover:bg-white/20 rounded-full p-2 transition-all', {
                        'opacity-50 cursor-not-allowed': isLastSlide,
                      })
                    "
                  >
                    <ChevronRight :size="36" stroke="#fff" stroke-width="3" />
                  </button>
                </div>

                <NuxtImg
                  :src="
                    index === 0 ? images[currentIndexImage]?.url : image.url
                  "
                  :alt="'Image- ' + index"
                  :class="[
                    'w-full object-cover transition-opacity duration-300',
                    {
                      'h-80': index === 0,
                      'h-28': index !== 0,
                      'opacity-50': index !== 0 && index !== currentIndexImage,
                    },
                  ]"
                />
              </div>
            </div>
          </div>

          <article class="col-span-2">
            <p :class="cn('text-base font-medium text-raisin-black')">
              {{ removeTagElements(storyDetail?.story?.content ?? "...") }}
            </p>
          </article>
        </section>

        <div
          v-else
          :class="
            cn(
              'mt-10 grid grid-cols-1 gap-4',
              'md:grid-cols-3',
              'lg:mt-10 lg:gap-6'
            )
          "
        >
          <UiSkeleton class="col-span-1 w-full h-[40vh]" />
          <UiSkeleton class="col-span-2 w-full h-[50vh]" />
        </div>

        <section class="mt-52">
          <UiSectionBar title="Similar Story" :isShowExploreMore="false" />
          <template v-if="!storyDetail?.similar_stories">
            <div class="grid grid-cols-3 gap-4 mt-3">
              <UiSkeletonCardSkeleton v-for="i in 3" :key="i" />
            </div>
          </template>
          <template v-else-if="storyDetail?.similar_stories?.length < 1">
            <p class="text-base font-medium text-raisin-black">
              No similar stories found
            </p>
          </template>
          <StoryModuleLayout
            v-else
            hasCategory
            variant="list"
            :stories="storyDetail?.similar_stories ?? []"
            :bookmarked="{
              action: handleBookmark,
            }"
          />
        </section>
      </LayoutsCommonLayout>
    </div>
  </LayoutsSEOLayout>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import {
  useStoryService,
  type StoryResponse,
  type StoryResponseDetail,
} from "~/composables/services/useStoryService";
import { useAuthenticationStore } from "~/stores/auth";
import { changeToNormalText } from "~/utils";

const { params } = useRoute();
const { getStoryBySlug } = useStoryService();

const authStore = useAuthenticationStore();
const { toggleOptimisticBookmark, pendingBookmarks, handleBookmarkError } =
  useBookmark();
const { showToast } = useCustomToastify();

const currentIndexImage = ref<number>(0);
const isLoading = ref<boolean>(false);

const storyDetail = ref<StoryResponseDetail | null>(null);

const userProfile = computed(() => authStore.userProfile);
const images = computed(() => storyDetail.value?.story?.images || []);

const currentTitle = changeToNormalText(
  params.slug as string,
  "trainCase"
)?.toUpperCase();

watch(
  () => images.value,
  () => {
    currentIndexImage.value = 0;
  }
);

const handlePrevious = () => {
  if (currentIndexImage.value > 0) {
    currentIndexImage.value--;
  }
};

const handleNext = () => {
  if (currentIndexImage.value < images?.value.length - 1) {
    currentIndexImage.value++;
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

const isFirstSlide = computed(() => currentIndexImage.value === 0);
const isLastSlide = computed(
  () => currentIndexImage.value === images.value.length - 1
);

const fetchDetailStory = async (slug: string): Promise<void> => {
  try {
    isLoading.value = true;

    const response = await getStoryBySlug(slug);

    if (response?.code === CODE_OK) {
      const data = response?.data as StoryResponseDetail;
      storyDetail.value = data;
    }

    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.error({ error });
  }
};

onMounted(() => {
  if (params.slug && !storyDetail.value)
    fetchDetailStory(params.slug as string);
});
</script>

<style scoped>
.content-images img {
  transition: all 0.3s ease-in-out;
}
</style>
