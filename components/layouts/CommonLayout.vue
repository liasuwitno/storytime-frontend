<template>
  <Navigation />

  <main
    :class="
      cn('', {
        'max-w-7xl mx-auto': props.container === 'lg',
      })
    "
  >
    <slot />
  </main>

  <Footer variantTop="md" :isFixedBottom="props.isFixedBottom" />
</template>
<script setup lang="ts">
import Footer from "@/components/Footer.vue";
import Navigation from "@/components/Navigation.vue";

const props = defineProps<{
  container?: "md" | "lg";
  isFixedBottom?: boolean;
}>();
</script>
