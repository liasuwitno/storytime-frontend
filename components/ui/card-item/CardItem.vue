<template>
  <div class="flex h-full flex-col justify-between">
    <figure class="relative group h-full overflow-hidden rounded-lg">
      <UiButton
        v-if="isMultipleMethod"
        size="icon"
        type="button"
        variant="default"
        :class="
          cn(
            'bg-asparagus hover:bg-asparagus/90 absolute bottom-5 z-50 transform translate-y-full opacity-0 visibility-hidden transition-all duration-300',
            'group-hover:translate-y-0 group-hover:opacity-100 group-hover:visibility-visible',
            {
              'right-20': props.type === 'normal',
              'right-5': props.type !== 'normal',
            }
          )
        "
        @click="handleDeleteClick"
      >
        <Trash2 :size="20" />
      </UiButton>

      <UiButton
        size="icon"
        type="button"
        variant="default"
        :class="
          cn(
            'bg-asparagus hover:bg-asparagus/90 absolute bottom-5 z-50 transform translate-y-full transition-all duration-300',
            {
              'opacity-0 visibility-hidden group-hover:translate-y-0 group-hover:opacity-100 group-hover:visibility-visible':
                !isBookmarked,
              'bottom-16 border-2 border-white': isBookmarked,
              'right-5': props.type === 'normal',
              'right-20': props.type !== 'normal',
            }
          )
        "
        @click="handleBookmarkClick"
      >
        <Bookmark :size="20" :fill="isBookmarked ? '#FFF' : 'none'" />
      </UiButton>

      <UiButton
        v-if="isMultipleMethod"
        size="icon"
        type="button"
        variant="default"
        :class="
          cn(
            'bg-asparagus hover:bg-asparagus/90 absolute bottom-5 right-[140px]',
            'z-50 transform translate-y-full opacity-0 visibility-hidden transition-all duration-300',
            'group-hover:translate-y-0 group-hover:opacity-100 group-hover:visibility-visible'
          )
        "
        @click="handleUpdateClick"
      >
        <Pencil :size="20" />
      </UiButton>

      <NuxtImg
        :src="
          story?.images?.length > 0
            ? story?.images[0]?.url
            : 'https://via.assets.so/img.jpg?w=800&h=400&tc=#cecece&bg=#cecece'
        "
        :alt="story?.title ?? 'Image'"
        class="w-full h-full object-cover"
      />

      <div
        class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
    </figure>

    <NuxtLink :to="props?.url" class="py-2">
      <div class="content">
        <h3
          :class="
            cn(
              'text-lg font-bold tracking-tight underline-offset-4 mt-2.5 mb-4 line-clamp-1',
              'md:text-2xl'
            )
          "
        >
          {{ story?.title ?? "-" }}
        </h3>
        <p
          :class="cn('text-sm line-clamp-3 text-gray-600 leading-normal h-16')"
        >
          {{ story?.content ?? "-" }}
        </p>
      </div>

      <div class="grid grid-cols-[1fr_60%] gap-2 mt-3 px-1">
        <template v-if="!isPrivateStory">
          <div class="flex items-center space-x-1.5 overflow-hidden">
            <NuxtImg
              :src="
                story?.author?.avatar ??
                'https://via.assets.so/img.jpg?w=800&h=400&tc=#cecece&bg=#cecece'
              "
              alt="Avatar"
              class="size-8 rounded-full"
            />
            <p
              :class="
                cn(
                  'text-sm text-raisin-black font-semibold tracking-tight',
                  'truncate'
                )
              "
            >
              {{ story?.author?.name ?? "-" }}
            </p>
          </div>

          <div
            :class="
              cn('flex items-center overflow-hidden', {
                'justify-end': !hasCategory,
                'justify-evenly': hasCategory,
              })
            "
          >
            <span
              :class="
                cn('text-xs text-raisin-black font-semibold tracking-tight')
              "
            >
              {{ formatDate(story?.created_at) }}
            </span>

            <UiBadge
              v-if="hasCategory"
              :class="
                cn(
                  'capitalize bg-[#F0F5ED] text-[#466543] font-medium',
                  'hover:bg-[#F0F5ED]/50'
                )
              "
            >
              {{ story?.category_name ?? "-" }}
            </UiBadge>
          </div>
        </template>

        <template v-else class="flex justify-between items-center">
          <UiBadge
            v-if="hasCategory"
            :class="
              cn(
                'capitalize bg-[#F0F5ED] text-[#466543] font-medium max-w-fit',
                'hover:bg-[#F0F5ED]/50'
              )
            "
          >
            {{ story?.category_name ?? "-" }}
          </UiBadge>

          <span
            :class="
              cn(
                'text-xs self-center ml-auto text-raisin-black font-semibold',
                'tracking-tight'
              )
            "
          >
            {{ formatDate(story?.created_at) }}
          </span>
        </template>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { Bookmark, Pencil, Trash2 } from "lucide-vue-next";
import type { StoryResponse } from "~/composables/services/useStoryService";

interface CardProps {
  story: StoryResponse;
  type?: "normal" | "detail";
  variant: "list" | "grid";
  url: string;
  index: number;
  isBookmarked?: boolean;
  isMultipleMethod?: boolean;
  isPrivateStory?: boolean;
  hasCategory?: boolean;
  methods: {
    updateOnClick?: () => void;
    deleteOnClick?: () => void;
    bookmarkOnClick: () => void;
  };
}

const props = defineProps<CardProps>();

const handleDeleteClick = (event: MouseEvent) => {
  event.stopPropagation();
  props.methods.deleteOnClick?.();
};

const handleBookmarkClick = (event: MouseEvent) => {
  event.stopPropagation();
  props.methods.bookmarkOnClick();
};

const handleUpdateClick = (event: MouseEvent) => {
  event.stopPropagation();
  props.methods.updateOnClick?.();
};
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg overflow-hidden;
}

.grid-card-large {
  @apply min-h-[685px];
}

.grid-card-small {
  @apply min-h-[240px];
}

figure {
  @apply relative w-full;
  aspect-ratio: 16/9;
}

.skeleton-wrapper {
  @apply animate-pulse;
}
</style>
