<template>JOS : {{ searchQuery }}</template>

<script setup lang="ts">
const route = useRoute();

// SSR CHECK
if (process.server) {
  const searchQuery = route.query.search;

  if (
    !searchQuery ||
    typeof searchQuery !== "string" ||
    searchQuery.trim() === ""
  ) {
    navigateTo("/", { redirectCode: 302 });
  }
}

const searchQuery = computed(() => route.query.search);
</script>
