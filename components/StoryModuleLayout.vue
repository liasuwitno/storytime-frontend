<template>
  <Flicking
    v-if="props.isSlider && isInitialized && props.stories?.length"
    ref="flickingRef"
    :class="
      cn('flex items-center mt-4 mb-8 cursor-pointer', 'md:mt-6 md:mb-20')
    "
    :hideBeforeInit="true"
    :options="{
      align: 'prev',
      circular: false,
      moveType: 'freeScroll',
      bound: true,
    }"
  >
    <div
      v-for="(story, index) in props.stories"
      :key="index"
      :class="cn('mr-5 w-[340px]')"
    >
      <UiCardItem
        type="normal"
        hasCategory
        :story="story"
        :variant="props.variant"
        :url="`/stories/${story.slug}`"
        :isBookmarked="story.is_bookmark"
        :index="index"
        :methods="{
          bookmarkOnClick: () => {
            console.log('ASU 2');
          },
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
      :key="index"
      :class="
        cn('', {
          'col-span-2 row-span-2': index === 0 && props.variant === 'grid',
          'col-span-1 row-span-1': index !== 0 && props.variant === 'grid',
        })
      "
    >
      <UiCardItem
        type="normal"
        :story="story"
        :variant="props.variant"
        :url="`/stories/${story.slug}`"
        :isBookmarked="story.is_bookmark"
        :index="index"
        :methods="{
          bookmarkOnClick: () => {
            console.log('ASU 1');
          },
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
import { ref, onMounted, nextTick } from "vue";

const props = defineProps<{
  isSlider?: boolean;
  variant: "list" | "grid";
  stories?: StoryResponse[];
}>();

const isInitialized = ref(false);
const flickingRef = ref<InstanceType<typeof Flicking> | null>(null);

onMounted(async () => {
  if (props.isSlider && props.stories?.length) {
    await nextTick();
    isInitialized.value = true;

    await nextTick();
    if (flickingRef.value) (flickingRef.value as any)?.init();
  }
});
</script>
