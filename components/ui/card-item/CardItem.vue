<template>
  <div class="flex h-full flex-col cursor-pointer justify-between">
    <figure class="relative h-full overflow-hidden rounded-lg group">
      <template v-for="(button, index) in enabledButtons" :key="button">
        <UiButton
          size="icon"
          type="button"
          variant="default"
          :class="getButtonClasses(button, index)"
          :disabled="bookmarked?.is_loading"
          @click="handleButtonClick(button, $event)"
        >
          <LoaderCircle
            v-if="bookmarked?.is_loading"
            :size="16"
            :stroke-width="3"
            :class="cn({ 'animate-spin': bookmarked?.is_loading })"
          />
          <component
            v-else
            :is="getButtonIcon(button)"
            :size="20"
            :fill="getButtonFill(button)"
          />
        </UiButton>
      </template>
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

    <NuxtLink :to="url" class="py-2">
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
          {{ removeTagElements(story?.content) ?? "..." }}
        </p>
      </div>
      <div
        :class="
          cn('grid gap-2 mt-3 px-1', {
            'grid-cols-[1fr_60%]': !isPrivateStory,
            'grid-cols-1': isPrivateStory,
          })
        "
      >
        <div
          v-if="!isPrivateStory"
          class="flex items-center space-x-1.5 overflow-hidden"
        >
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
            cn('flex items-center space-x-2 overflow-hidden', {
              'justify-end': !isPrivateStory,
              'justify-between': isPrivateStory,
            })
          "
        >
          <span
            :class="
              cn('text-xs text-raisin-black font-semibold tracking-tight')
            "
            >{{ formatDate(story?.created_at) }}</span
          >
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
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { Bookmark, Pencil, Trash2, LoaderCircle } from "lucide-vue-next";
import type { StoryResponse } from "~/composables/services/useStoryService";

interface CardProps {
  story: StoryResponse;
  url: string;
  type?: "normal" | "detail";
  variant: "list" | "grid";
  isPrivateStory?: boolean;
  hasCategory?: boolean;
  bookmarked?: {
    is_bookmark: boolean;
    is_loading: boolean;
  };
  enabledButtons?: Array<"delete" | "update" | "bookmark">;
  actions: {
    update?: () => void;
    delete?: () => void;
    bookmark?: () => void;
  };
}

const props = defineProps<CardProps>();

const BUTTON_CONFIG = {
  delete: {
    icon: Trash2,
    action: "delete",
  },
  update: {
    icon: Pencil,
    action: "update",
  },
  bookmark: {
    icon: Bookmark,
    action: "bookmark",
  },
} as const;

const getButtonClasses = (buttonType: string, index: number) => {
  const totalButtons = props.enabledButtons?.length || 0;

  const getPosition = () => {
    if (totalButtons === 1) {
      return "right-5";
    }
    if (totalButtons === 2) {
      return index === 0 ? "right-5" : "right-20";
    }
    if (totalButtons === 3) {
      switch (index) {
        case 0:
          return "right-5";
        case 1:
          return "right-20";
        case 2:
          return "right-[140px]";
        default:
          return "right-5";
      }
    }
    return "right-5";
  };

  return cn(
    "bg-asparagus hover:bg-asparagus/90 absolute bottom-5 z-[25] transition-all duration-300",
    // "disabled:pointer-events-none disabled:opacity-50 transform translate-y-full",
    getPosition(),
    {
      // "opacity-0 visibility-hidden group-hover:translate-y-0 group-hover:opacity-100 group-hover:visibility-visible":
      //   buttonType === "bookmark" ? !props.bookmarked?.is_bookmark : true,
      // "bottom-16 border-2 border-white":
      "bottom-5 border-2 border-white":
        buttonType === "bookmark" && props.bookmarked?.is_bookmark,
    }
  );
};

const getButtonIcon = (buttonType: keyof typeof BUTTON_CONFIG) => {
  return BUTTON_CONFIG[buttonType].icon;
};

const getButtonFill = (buttonType: string) => {
  return buttonType === "bookmark" && props.bookmarked?.is_bookmark
    ? "#FFF"
    : "none";
};

const handleButtonClick = (buttonType: string, event: MouseEvent) => {
  event.stopPropagation();

  const actionName =
    BUTTON_CONFIG[buttonType as keyof typeof BUTTON_CONFIG].action;
  props.actions[actionName]?.();
};
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg overflow-hidden;
}
figure {
  @apply relative w-full;
  aspect-ratio: 16/9;
}
.skeleton-wrapper {
  @apply animate-pulse;
}
</style>
