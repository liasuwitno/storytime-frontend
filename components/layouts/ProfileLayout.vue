<template>
  <div :class="cn('grid grid-cols-[1fr_2fr] gap-5')">
    <div class="row-span-1 min-h-64 max-h-64">
      <UiCard
        :class="
          cn(
            'h-full flex flex-col items-center justify-center text-center',
            'px-9'
          )
        "
      >
        <h2 class="font-bold text-raisin-black text-2xl leading-normal mb-3">
          Write your story
        </h2>
        <p class="font-medium raising-black text-base leading-normal mb-5">
          Share your unique voice with the world - start writing your story
          today!
        </p>

        <UiButton
          type="button"
          size="default"
          variant="default"
          @click="redirectToCreatePost"
          :class="cn('bg-olive-drab px-6 h-12', 'hover:bg-olive-drab/90')"
        >
          Write Now
        </UiButton>
      </UiCard>
    </div>

    <div :class="cn('grid row-span-1 grid-cols-2 gap-5')">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import { navigateTo } from "#app";

const redirectToCreatePost = (): void => {
  navigateTo("/profile/story/create");
};
</script>
