<template>
  <LayoutsCommonLayout container="lg">
    <Hero />

    <section>
      <UiSectionBar
        title="Latest Story"
        redirectLink="/stories"
        isShowExploreMore
      />
      <StoryModuleLayout :stories="MOCK_DATA" variant="list" isSlider />
    </section>

    <section>
      <UiSectionBar title="Comedy" redirectLink="/comedy" isShowExploreMore />
      <StoryModuleLayout :stories="FIND_THREE_MOCK_DATA" variant="grid" />
    </section>

    <section>
      <UiSectionBar title="Romance" redirectLink="/romance" isShowExploreMore />
      <StoryModuleLayout :stories="FIND_THREE_MOCK_DATA" variant="list" />
    </section>

    <section>
      <UiSectionBar title="Horror" redirectLink="/horror" isShowExploreMore />
      <StoryModuleLayout :stories="FIND_THREE_MOCK_DATA" variant="grid" />
    </section>

    <section>
      <UiSectionBar title="More Categories" />
      <div class="relative flex items-center space-x-4 flex-wrap mt-8">
        <NuxtLink
          :key="category.id"
          v-for="category in CATEGORIES"
          :to="`/categories/${category.id}`"
          :class="
            cn('bg-[#F0F5ED] px-8 py-7 rounded-md', 'hover:bg-[#F0F5ED]/50')
          "
        >
          <p :class="cn('text-[#466543] font-medium text-base tracking-tight')">
            {{ category.name }}
          </p>
        </NuxtLink>
      </div>
    </section>
  </LayoutsCommonLayout>
</template>

<script setup lang="ts"></script>
