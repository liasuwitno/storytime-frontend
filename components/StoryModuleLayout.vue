<template>
  <Flicking
    :class="cn('flex items-center mt-4 mb-8', 'md:mt-6 md:mb-20')"
    :hideBeforeInit="true"
    v-if="props.isSlider"
    :options="{
      align: 'prev',
      circular: false,
      moveType: 'freeScroll',
      bound: true,
    }"
  >
    <div
      v-for="(story, index) in props.similarStories"
      :key="story.title"
      :class="cn('mr-5 w-[340px]')"
    >
      <UiCardItem
        type="normal"
        :story="story"
        :variant="props.variant"
        :url="`/stories/${story.slug}`"
        :index="index"
        :methods="{
          bookmarkOnClick: () => {},
        }"
      />
    </div>
  </Flicking>

  <div
    v-else
    :class="cn('grid grid-cols-3 gap-6 mt-4 mb-8', 'md:mt-6 md:mb-20')"
  >
    <div
      v-for="(story, index) in props.stories"
      :key="story.story_id"
      :class="
        cn('', {
          'col-span-2 row-span-2': index === 0 && props.variant === 'grid',
          'col-span-1 row-span-1': index !== 0 && props.variant === 'grid',
        })
      "
    >
      <UiCardItem
        isMultipleMethod
        type="normal"
        :story="story"
        :variant="props.variant"
        :url="`/stories/${story.slug}`"
        :index="index"
        :methods="{
          bookmarkOnClick: () => {},
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StoryResponse } from "~/composables/services/useStoryService";

import { cn } from "@/utils";
import Flicking from "@egjs/vue3-flicking";

import "@egjs/vue3-flicking/dist/flicking-inline.css";

const props = defineProps<{
  isSlider?: boolean;
  variant: "list" | "grid";
  stories?: StoryResponse[];
  similarStories?: StoryResponse[];
}>();
</script>
