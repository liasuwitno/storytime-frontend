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

      <div :class="cn('flex items-center justify-end space-x-2')">
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
    </nav>
  </header>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
import { ref, onMounted, onUnmounted } from "vue";

import { cn } from "@/utils";

const isScrolled = ref(false);

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
