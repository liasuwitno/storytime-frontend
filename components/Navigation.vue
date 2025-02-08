<template>
  <header
    :class="
      cn(
        'fixed top-0 left-0 z-30 border-b w-full bg-white backdrop-blur-sm transition-all',
        {
          'bg-white/60 shadow-md shadow-gray-100 border-b-0': isScrolled,
        }
      )
    "
  >
    <nav
      :class="
        cn(
          'max-w-7xl mx-auto grid grid-cols-2 items-center py-3 px-0',
          'md:px-0'
        )
      "
    >
      <div :class="cn('text-xl font-bold tracking-tight')">
        <NuxtLink to="/" :class="cn('text-white md:text-gray-900')">
          <NuxtImg src="/images/storytime.png" class="h-9" alt="storytime" />
        </NuxtLink>
      </div>

      <div :class="cn('flex items-center justify-end space-x-10')">
        <UiPopover>
          <UiPopoverTrigger as-child>
            <button type="button" class="relative">
              <Bell />

              <div
                v-if="messages?.length > 0"
                :class="
                  cn(
                    'absolute -top-2 -right-2 h-5 w-5',
                    'rounded-full bg-red-500 flex items-center justify-center'
                  )
                "
              >
                <span class="text-xs text-white font-medium">
                  {{ messages?.length ?? 0 }}
                </span>
              </div>
            </button>
          </UiPopoverTrigger>

          <UiPopoverContent :class="cn('w-80 mt-2')">
            <div class="block">
              <div class="space-y-1 border-b pb-2">
                <h4 class="font-medium leading-none">Notifications</h4>
                <p class="text-sm text-muted-foreground">
                  See more all notifications
                </p>
              </div>

              <div v-if="messages?.length > 0" :class="cn('flex flex-col')">
                <NuxtLink
                  v-for="(item, index) in messages"
                  :key="index"
                  :to="`/stories/${item?.slug}`"
                  :class="cn('p-1 border-b overflow-hidden w-full')"
                >
                  <h4
                    :class="
                      cn(
                        'font-semibold font-sans tracking-tight',
                        'line-clamp-2 max-w-full break-words',
                        'hover:underline'
                      )
                    "
                  >
                    {{ item?.message ?? "" }}
                  </h4>

                  <div :class="cn('flex items-center justify-end')">
                    <span :class="cn('text-xs text-muted-foreground')">
                      {{
                        convertEpochTimestampToReadable(item?.timestamp) ?? ""
                      }}
                    </span>
                  </div>
                </NuxtLink>
              </div>

              <div v-else :class="cn('py-2 text-center')">
                <h4 :class="cn('font-medium tracking-tight text-sm')">
                  No more notifications
                </h4>
              </div>
            </div>
          </UiPopoverContent>
        </UiPopover>

        <div :class="cn('space-x-2')">
          <UiButton
            type="button"
            @click="redirectToRegister"
            variant="outline"
            size="default"
            :class="
              cn(
                'text-olive-drab border-olive-drab border-2',
                'hover:text-white hover:bg-olive-drab'
              )
            "
            >Register</UiButton
          >
          <UiButton
            type="button"
            @click="redirectToLogin"
            size="default"
            variant="default"
            :class="cn('bg-olive-drab', 'hover:bg-olive-drab/90')"
            >Login</UiButton
          >
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";

import { cn } from "@/utils";
import { Bell } from "lucide-vue-next";
import { UiPopover } from "#components";
import { usePusherNotifications } from "~/composables/services/useNotifications";

const config = useRuntimeConfig();
const isScrolled = ref(false);

const messages = [
  {
    id: 1,
    message: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    slug: "story-1",
    timestamp: 1658644000000,
  },
];
// const { messages } = usePusherNotifications({
//   appKey: config.public.NUXT_PUSHER_APP_KEY,
//   cluster: config.public.NUXT_PUSHER_APP_CLUSTER,
//   channelName: config.public.NUXT_PUSHER_APP_CHANNEL_NAME,
//   eventName: config.public.NUXT_PUSHER_APP_EVENT_NAME,
//   enableLogging: true,
// });

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0;
};

const redirectToLogin = (): void => {
  navigateTo("/login");
};

const redirectToRegister = (): void => {
  navigateTo("/register");
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
