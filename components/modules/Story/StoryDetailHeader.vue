<template>
  <div :class="cn('grid grid-cols-1 gap-4', 'md:grid-cols-[15%_1fr_15%]')">
    <div />
    <div
      :class="cn('flex flex-col text-center justify-center overflow-hidden')"
    >
      <h6 :class="cn('text-quartz text-base font-semibold')">
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
        <UiAvatar :src="users.avatar" :alt="users.name" />
        <p :class="cn('font-semibold text-base text-raisin-black')">
          {{ users.name ?? "-" }}
        </p>
      </div>
    </div>
    <div class="border">2</div>
  </div>
</template>

<script setup lang="ts">
interface UserDetailProps {
  name: string;
  avatar: string;
}

defineProps<{
  users: UserDetailProps;
  createdAt: string;
  title: string;
}>();
</script>
<style lang=""></style>
