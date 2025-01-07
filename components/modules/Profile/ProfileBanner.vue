<template lang="">
  <section :class="cn('bg-[#F0F5ED]')">
    <div
      :class="
        cn(
          'max-w-6xl mx-auto flex items-center justify-start min-h-[45vh]',
          'pt-10'
        )
      "
    >
      <div class="w-full grid grid-cols-[20%_1fr_20%] items-center gap-4">
        <div class="flex justify-center">
          <NuxtImg
            src="https://dl.dropbox.com/scl/fi/xpzps77me2votw6y204ny/avatar-2.png?rlkey=fcr27tau2wffcugzlxq41bi26&st=82hsf9kj&dl=0"
            class="w-40 h-40 rounded-full object-cover"
            alt="profile-avatar"
          />
        </div>
        <div class="block">
          <h1
            class="font-bold tracking-tight text-2xl leading-normal text-raisin-black line-clamp-1"
          >
            John Doe
          </h1>
          <p
            class="text-base font-medium text-raisin-black tracking-tight mt-1"
          >
            dewiratnaiswara99@gmail.com
          </p>
          <p
            class="text-quartz font-medium text-base leading-normal mt-4 line-clamp-3"
          >
            Avid reader and aspiring writer. Lover of mysteries, thrillers, and
            sci-fi. Coffee enthusiast and nature explorer. Always on the lookout
            for new stories and adventures.
          </p>
        </div>

        <div class="profile-cta">
          <UiButton
            size="default"
            variant="default"
            :class="cn('bg-olive-drab', 'hover:bg-olive-drab/90')"
          >
            Edit Profile
          </UiButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style lang=""></style>
