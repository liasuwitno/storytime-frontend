<template>
  <div :class="cn('pt-14')">
    <div :class="cn('bg-[#F0F5ED] mb-14')">
      <UiBreadcrumb :class="cn('max-w-7xl mx-auto font-semibold py-7')">
        <UiBreadcrumbList>
          <UiBreadcrumbItem>
            <NuxtLink
              :class="cn('text-asparagus text-base', 'hover:text-asparagus/80')"
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
          :users="storyDetail?.story?.user"
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
              v-for="(image, index) in storyDetail?.story?.images"
              :key="index"
              :class="[
                'rounded-md overflow-hidden cursor-pointer',
                {
                  'col-span-3': index === 0,
                  'col-span-1': index !== 0,
                },
              ]"
              @click="handleImageClick(index)"
            >
              <NuxtImg
                :src="image?.url ?? ''"
                :alt="'Image- ' + index"
                :class="[
                  'w-full object-cover',
                  {
                    'h-72': index === 0,
                    'h-28': index !== 0,
                  },
                ]"
              />
            </div>
          </div>
        </div>

        <article class="col-span-2">
          <p :class="cn('text-base font-medium text-raisin-black')">
            {{ storyDetail?.story?.body ?? "..." }}
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
        <template v-if="!storyDetail?.similar_stories?.length">
          <p class="text-base font-medium text-raisin-black">
            No similar stories found
          </p>
        </template>
        <StoryModuleLayout
          v-else
          :stories="storyDetail?.similar_stories ?? []"
          variant="list"
          hasCategory
        />
      </section>
    </LayoutsCommonLayout>
  </div>
</template>

<script setup lang="ts">
import {
  useStoryService,
  type StoryResponseDetail,
} from "~/composables/services/useStoryService";
import { changeToNormalText } from "~/utils";

const { params } = useRoute();
const { getStoryBySlug } = useStoryService();

const isLoading = ref<boolean>(false);
const storyDetail = ref<StoryResponseDetail | null>(null);

const handleImageClick = (clickedIndex: number): void => {};

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
  if (params.slug) fetchDetailStory(params.slug as string);
});
</script>
