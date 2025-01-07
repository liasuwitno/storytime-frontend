<template>
  <div :class="cn('card flex flex-col justify-between cursor-pointer')">
    <figure class="relative group overflow-hidden rounded-lg">
      <UiButton
        v-if="isMultipleMethod"
        size="icon"
        type="button"
        variant="default"
        :class="
          cn(
            'bg-asparagus hover:bg-asparagus/90 absolute bottom-5 z-50 transform translate-y-full opacity-0 visibility-hidden group-hover:translate-y-0 group-hover:opacity-100 group-hover:visibility-visible transition-all duration-300',
            {
              'right-20': props.type === 'normal',
              'right-5': props.type !== 'normal',
            }
          )
        "
        @click="methods.deleteOnClick || (() => {})"
      >
        <Trash2 class="h-20" />
      </UiButton>

      <UiButton
        size="icon"
        type="button"
        variant="default"
        :class="
          cn(
            'bg-asparagus hover:bg-asparagus/90 absolute bottom-5 z-50 transform translate-y-full opacity-0 visibility-hidden group-hover:translate-y-0 group-hover:opacity-100 group-hover:visibility-visible transition-all duration-300',
            {
              'right-5': props.type === 'normal',
              'right-20': props.type !== 'normal',
            }
          )
        "
        @click="methods.bookmarkOnClick || (() => {})"
      >
        <Bookmark class="h-20" />
      </UiButton>

      <UiButton
        v-if="isMultipleMethod"
        size="icon"
        type="button"
        variant="default"
        :class="
          cn(
            'bg-asparagus hover:bg-asparagus/90 absolute bottom-5 right-[140px] z-50 transform translate-y-full opacity-0 visibility-hidden group-hover:translate-y-0 group-hover:opacity-100 group-hover:visibility-visible transition-all duration-300'
          )
        "
        @click="methods.updateOnClick || (() => {})"
      >
        <Pencil class="h-20" />
      </UiButton>

      <NuxtImg
        :src="story?.banner ?? ''"
        :alt="story?.author_name ?? 'Image'"
        :class="
          cn('w-full object-cover', {
            'h-[685px]': props.index === 0 && props.variant === 'grid',
            'h-[240px]': props.index !== 0 && props.variant === 'grid',
            'h-64': props.variant === 'list',
          })
        "
      />

      <div
        class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
    </figure>

    <div class="py-2">
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
        <p :class="cn('text-sm line-clamp-3 text-gray-600 leading-normal')">
          {{ story?.body ?? "-" }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-2 mt-3">
        <div class="flex items-center space-x-2 overflow-hidden">
          <NuxtImg
            :src="story.avatar"
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
            {{ story.author_name }}
          </p>
        </div>

        <div
          :class="
            cn('space-x-1.5 flex items-center overflow-hidden', {
              'justify-end': !hasCategory,
            })
          "
        >
          <span
            :class="
              cn('text-xs text-raisin-black font-semibold tracking-tight')
            "
            >{{ formatDate(story.created_at) }}</span
          >

          <UiBadge v-if="hasCategory" class="capitalize">
            {{ story.category_name }}
          </UiBadge>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Bookmark, Pencil, Trash2 } from "lucide-vue-next";

interface CardItemProps {
  title: string;
  body: string;
  banner: string;
  category_name: string;
  author_name: string;
  avatar: string;
  created_at: string;
}

interface CardProps {
  story: CardItemProps;
  type?: "normal" | "detail";
  variant: "list" | "grid";
  url: string;
  index: number;
  isMultipleMethod?: boolean;
  hasCategory?: boolean;
  methods: {
    updateOnClick?: () => void;
    deleteOnClick?: () => void;
    bookmarkOnClick: () => void;
  };
}

const props = defineProps<CardProps>();
</script>
