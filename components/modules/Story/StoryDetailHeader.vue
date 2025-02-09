<template>
  <div :class="cn('grid grid-cols-1 gap-4', 'md:grid-cols-[15%_1fr_15%]')">
    <div />

    <div
      v-if="!isLoading"
      :class="cn('flex flex-col text-center justify-center overflow-hidden')"
    >
      <h6 :class="cn('text-quartz text-lg font-semibold tracking-tight')">
        {{ formatDate(createdAt) }}
      </h6>
      <h1
        :class="
          cn('text-5xl font-mono font-bold tracking-tight truncate', 'my-8')
        "
      >
        {{ title ?? "-" }}
      </h1>

      <div class="flex items-center justify-center space-x-2">
        <UiAvatar>
          <NuxtImg
            :src="users?.avatar ?? ''"
            :alt="users?.name"
            :class="cn('bg-cover')"
          />
        </UiAvatar>
        <p :class="cn('font-semibold text-base text-raisin-black')">
          {{ users?.name ?? "-" }}
        </p>
      </div>
    </div>

    <div
      v-else
      :class="
        cn(
          'w-full max-w-[90%] mx-auto p-4',
          'flex flex-col items-center justify-center'
        )
      "
    >
      <UiSkeleton class="h-6 w-56 rounded-sm" />
      <UiSkeleton class="h-14 max-w-xl w-full rounded-sm my-8" />

      <div :class="cn('flex items-center space-x-2')">
        <UiSkeleton class="h-12 w-12 rounded-full" />
        <UiSkeleton class="h-8 w-[180px]" />
      </div>
    </div>

    <div class="flex justify-end">
      <UiSkeleton v-if="isLoading" class="h-12 w-12 rounded-full" />

      <UiButton
        v-else
        size="icon"
        type="button"
        variant="default"
        :class="
          cn('bg-asparagus hover:bg-asparagus/90 transition-all duration-300')
        "
      >
        <Bookmark class="h-28" />
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bookmark } from "lucide-vue-next";
import type { StoryResponseDetail } from "~/composables/services/useStoryService";

const isLoading = ref<boolean>(true);

const props = defineProps<{
  users: StoryResponseDetail["story"]["author"] | undefined;
  createdAt: string;
  title: string;
}>();

watchEffect(() => {
  if (props.users) {
    isLoading.value = false;
  }
});
</script>
