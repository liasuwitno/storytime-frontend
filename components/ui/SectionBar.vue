<template>
  <div
    :class="
      cn(
        'flex items-center justify-between w-full pb-6 mb-2 border-b border-[#CCCCCC]'
      )
    "
  >
    <h4
      :class="
        cn(
          'font-mono text-3xl font-bold tracking-tight text-raisin-black',
          'md:text-4xl'
        )
      "
    >
      {{ props.title || "" }}
    </h4>

    <div v-if="props.isShowExploreMore">
      <RouterLink
        :to="props.redirectLink || '/'"
        :class="
          cn(
            'flex items-center space-x-2 font-sans text-base font-semibold text-quartz',
            'hover:underline'
          )
        "
      >
        <span>Explore More</span> <MoveRight :size="20" />
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SectionBarProps {
  title: string;
  redirectLink?: string;
  isShowExploreMore?: boolean;
}

import { MoveRight } from "lucide-vue-next";
import { cn } from "~/utils";

const props = defineProps<SectionBarProps>();
</script>
