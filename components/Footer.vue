<template>
  <footer
    :class="
      cn('border-t border-quartz bg-white', {
        'mt-32': props.variantTop === 'md',
        'mt-52': props.variantTop === 'lg',
      })
    "
  >
    <nav
      :class="
        cn(
          'flex items-center justify-between flex-col py-4',
          'md:flex-row md:max-w-7xl md:mx-auto md:py-6'
        )
      "
    >
      <h6 :class="cn('font-semibold tracking-tight text-base text-quartz')">
        © {{ currentYear }} PT. Timedoor Indonesia. All rights reserved.
      </h6>
      <div :class="cn('flex items-center space-x-2')">
        <Facebook :size="30" />
        <Instagram :size="30" />
        <Youtube :size="30" />
      </div>
    </nav>
  </footer>
</template>
<script setup lang="ts">
import { cn } from "@/utils";

import { Facebook, Instagram, Youtube } from "lucide-vue-next";

const props = defineProps<{
  variantTop: "md" | "lg";
}>();

const currentYear = new Date().getFullYear();
</script>
