<template>
  <section
    :class="
      cn(
        'max-w-5xl mx-auto flex items-center justify-center min-h-screen',
        'flex-col text-center'
      )
    "
  >
    <h1
      :class="
        cn(
          'font-mono text-raisin-black text-6xl font-bold tracking-tight leading-normal'
        )
      "
    >
      Welcome to Storytime
    </h1>
    <p :class="cn('text-charcoal-gray text-xl font-medium')">
      The world's most-loved social storytelling platform. Story time connects a
      global community of 90 million readers and writers through the power of
      story.
    </p>

    <div class="my-10 w-full">
      <UiInput
        type="text"
        placeholder="Search Story"
        :inputClass="cn('py-6 px-4 font-medium text-sm')"
        :iconRight="Search"
      />
    </div>

    <figure class="text-center">
      <NuxtImg
        src="/images/storytime-illustration-op.webp"
        alt="storytime-illustration"
        :class="cn('h-80 w-auto inline-block')"
      />
    </figure>
  </section>
</template>

<script setup lang="ts">
import { cn } from "@/utils";
import { Search } from "lucide-vue-next";
</script>
