<template>
  <section :class="cn('bg-[#F0F5ED]')">
    <div
      :class="
        cn(
          'max-w-6xl mx-auto flex items-center justify-start min-h-[45vh]',
          'pt-10'
        )
      "
    >
      <div
        v-if="!props.profile"
        class="w-full grid grid-cols-[20%_1fr_20%] items-center gap-4"
      >
        <UiSkeleton :class="cn('w-40 h-40 rounded-full')" />

        <div class="block space-y-2">
          <UiSkeleton :class="cn('w-48 h-8')" />
          <UiSkeleton :class="cn('w-56 h-6')" />
          <UiSkeleton :class="cn('w-96 h-14')" />
        </div>

        <div class="profile-cta">
          <UiSkeleton :class="cn('w-24 h-8')" />
        </div>
      </div>

      <div
        v-else
        class="w-full grid grid-cols-[20%_1fr_20%] items-center gap-4"
      >
        <div class="flex justify-center">
          <NuxtImg
            :src="
              props.profile?.avatar ??
              'https://via.assets.so/img.jpg?w=800&h=400&tc=#cecece&bg=#cecece'
            "
            class="w-40 h-40 rounded-full object-cover"
            alt="profile-avatar"
          />
        </div>

        <div class="block">
          <h1
            class="font-bold tracking-tight text-2xl leading-normal text-raisin-black line-clamp-1"
          >
            {{ props.profile?.fullname ?? "-" }}
          </h1>
          <p
            class="text-base font-medium text-raisin-black tracking-tight mt-1"
          >
            {{ props.profile?.email ?? "-" }}
          </p>
          <p
            class="text-quartz font-medium text-base leading-normal mt-4 line-clamp-3"
          >
            {{ props.profile?.bio ?? "-" }}
          </p>
        </div>

        <div class="profile-cta">
          <UiButton
            size="default"
            variant="default"
            :class="cn('bg-olive-drab', 'hover:bg-olive-drab/90')"
          >
            Edit Profile
          </UiButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ProfileResponse } from "~/composables/services/useAuthService";

interface Props {
  profile: ProfileResponse | null;
}

const props = defineProps<Props>();
</script>
