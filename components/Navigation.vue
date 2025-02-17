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
        <NuxtLink
          to="/"
          :class="cn('text-white md:text-gray-900 cursor-pointer')"
        >
          <NuxtImg src="/images/storytime.png" class="h-9" alt="storytime" />
        </NuxtLink>
      </div>

      <div :class="cn('flex items-center justify-end space-x-10')">
        <UiPopover>
          <UiPopoverTrigger as-child>
            <button type="button" class="relative">
              <Bell :size="24" />

              <div
                v-if="messages?.length > 0"
                :class="
                  cn(
                    'absolute -top-1.5 -right-1.5 h-4 w-4',
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

        <div v-if="isLoadingProfileUser">
          <UiSkeleton :class="cn('w-40 h-8')" />
        </div>

        <div
          v-else-if="isLoggedIn && profileUser"
          class="flex items-center space-x-1.5 overflow-hidden"
        >
          <NuxtImg
            :src="
              profileUser?.avatar ??
              'https://via.assets.so/img.jpg?w=800&h=400&tc=#cecece&bg=#cecece'
            "
            :alt="profileUser?.fullname"
            class="size-10 rounded-full"
          />

          <p
            :class="
              cn(
                'text-base text-raisin-black font-semibold tracking-tight',
                'max-w-40 w-full line-clamp-1'
              )
            "
          >
            {{ profileUser?.fullname ?? "-" }}
          </p>

          <UiMenubar :class="cn('border-none')">
            <UiMenubarMenu>
              <UiMenubarTrigger :class="cn('px-0 py-0 cursor-pointer')">
                <ChevronDown />
              </UiMenubarTrigger>
              <UiMenubarContent>
                <UiMenubarItem
                  @click="navigateTo('/profile')"
                  :class="cn('cursor-pointer')"
                >
                  <p :class="cn('font-semibold w-full block')">My Profile</p>
                </UiMenubarItem>
                <UiMenubarSeparator />

                <UiDialog>
                  <UiDialogTrigger as-child>
                    <button
                      type="button"
                      :class="
                        cn(
                          'font-semibold w-full text-left text-sm px-2.5 py-1.5'
                        )
                      "
                    >
                      Logout
                    </button>

                    <UiDialogContent class="sm:max-w-[400px]">
                      <UiDialogHeader>
                        <UiDialogTitle
                          :class="
                            cn('font-semibold text-3xl text-center', 'mb-1')
                          "
                        >
                          Logout
                        </UiDialogTitle>
                        <UiDialogDescription
                          :class="cn('text-center text-base font-medium')"
                        >
                          Are you sure want to logout?
                        </UiDialogDescription>
                      </UiDialogHeader>

                      <UiDialogFooter class="mx-auto space-x-2 mt-4">
                        <UiDialogClose asChild>
                          <UiButton
                            type="button"
                            variant="outline"
                            size="lg"
                            :disabled="isLoadingLogout"
                            :class="
                              cn(
                                'text-olive-drab border-olive-drab border-2 text-base',
                                'hover:text-white hover:bg-olive-drab'
                              )
                            "
                          >
                            Cancel
                          </UiButton>
                        </UiDialogClose>

                        <UiButton
                          type="button"
                          variant="default"
                          size="lg"
                          @click="handleLogout"
                          :disabled="isLoadingLogout"
                          :class="
                            cn(
                              'bg-olive-drab text-base',
                              'hover:bg-olive-drab/90'
                            )
                          "
                        >
                          {{ isLoadingLogout ? "Logging out..." : "Logout" }}
                        </UiButton>
                      </UiDialogFooter>
                    </UiDialogContent>
                  </UiDialogTrigger>
                </UiDialog>
              </UiMenubarContent>
            </UiMenubarMenu>
          </UiMenubar>
        </div>

        <div v-else :class="cn('space-x-2')">
          <UiButton
            type="button"
            variant="outline"
            size="default"
            :class="
              cn(
                'text-olive-drab border-olive-drab border-2',
                'hover:text-white hover:bg-olive-drab'
              )
            "
            @click="redirectToRegister"
          >
            Register
          </UiButton>
          <UiButton
            type="button"
            variant="default"
            size="default"
            :class="cn('bg-olive-drab', 'hover:bg-olive-drab/90')"
            @click="redirectToLogin"
          >
            Login
          </UiButton>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";

import { cn } from "@/utils";
import { Bell, ChevronDown } from "lucide-vue-next";
import { UiPopover } from "#components";
import { usePusherNotifications } from "~/composables/services/useNotifications";
import { useAuthenticationStore } from "~/stores/auth";
import { useAuthService } from "~/composables/services/useAuthService";
import { useBookmarkStore } from "~/stores/bookmark";

const config = useRuntimeConfig();
const isScrolled = ref<boolean>(false);

const store = useAuthenticationStore();
const storeBookmark = useBookmarkStore();

const profileUser = computed(() => store.userProfile);
const isLoadingProfileUser = computed(() => store.isLoadingProfile);

const { logOut } = useAuthService();

const isLoggedIn = computed(() => store.isLoggedIn);
const isLoadingLogout = ref<boolean>(false);

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

const handleLogout = async (): Promise<void> => {
  try {
    isLoadingLogout.value = true;
    const response = await logOut();

    if (response.code === CODE_OK) {
      store.logoutLocal();
      storeBookmark.setResetBookmarks();
    }

    isLoadingLogout.value = false;
  } catch (error) {
    console.error("[ERROR LOGOUT] : ", error);
  } finally {
    isLoadingLogout.value = false;
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
