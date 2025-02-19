<template>
  <slot />
</template>
<script setup lang="ts">
interface AppLayoutProps {
  title?: string | any;
  description?: string;
  url?: string;
}

const props = defineProps<AppLayoutProps>();

useHead({
  title: props.title ? `Storytime - ${props.title}` : "Storytime",
  meta: [{ content: props.description }],
  link: [{ rel: "canonical", href: props.url }],
});
</script>
<style lang=""></style>
