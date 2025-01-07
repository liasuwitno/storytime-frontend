<template>
  <div class="flex items-center space-x-6">
    <NuxtLink :to="props.urlBack">
      <MoveLeft :size="34" :class="cn('flex-shrink-0')" />
    </NuxtLink>
    <h4
      :class="
        cn(
          'font-mono text-[42px] select-none leading-normal font-bold tracking-tight'
        )
      "
    >
      {{ props?.title ?? "" }}
    </h4>
  </div>
</template>

<script setup lang="ts">
import { MoveLeft } from "lucide-vue-next";

const props = defineProps<{
  title?: string;
  urlBack?: string;
}>();
</script>
<style lang=""></style>
