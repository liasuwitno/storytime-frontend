<template>
  <div :class="cn('flex flex-col justify-between')">
    <UiSkeleton class="w-full h-40 rounded-lg" />
    <div class="space-y-2 mt-2">
      <UiSkeleton class="w-3/4 h-8" />
      <UiSkeleton class="w-full h-16" />
      <div class="flex justify-between">
        <UiSkeleton class="w-1/4 h-6" />
        <UiSkeleton class="w-1/2 h-6" />
      </div>
    </div>
  </div>
</template>
<script setup></script>
