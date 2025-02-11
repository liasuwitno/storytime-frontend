<template>
  <NuxtLoadingIndicator color="#466543" :throttle="0" :height="5" />

  <NuxtLayout>
    <div class="antialiased relative min-h-screen">
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAuthenticationStore } from "./stores/auth";

const authStore = useAuthenticationStore();

onMounted(() => {
  if (authStore.isLoggedIn) {
    authStore.loadProfile();
  }
});
</script>
