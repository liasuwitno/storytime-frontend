<script lang="ts" setup>
import type { LabelProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils";

const props = defineProps<LabelProps & { class?: HTMLAttributes["class"] }>();
</script>

<template>
  <Label :class="cn('font-semibold text-base', props.class)">
    <slot />
  </Label>
</template>
