<script setup lang="ts">
import UserAuthFormRegister from "@/components/modules/Authentication/AuthRegister.vue";
</script>

<template>
  <LayoutsSEOLayout title="Register">
    <section
      :class="
        cn(
          'md:grid',
          'container relative hidden h-screen flex-col items-center justify-center',
          'lg:max-w-none lg:grid-cols-2 lg:px-0'
        )
      "
    >
      <div :class="cn('p-3 h-full hidden select-none', 'lg:p-5 lg:block')">
        <div
          :class="
            cn(
              'relative hidden h-full flex-col bg-muted p-10 text-white',
              'dark:border-r lg:flex'
            )
          "
        >
          <div class="absolute inset-0 bg-cyan" />

          <NuxtLink to="/" class="relative z-20">
            <NuxtImg
              src="/images/storytime.png"
              :class="cn('h-11')"
              alt="storytime"
            />
          </NuxtLink>

          <div :class="cn('relative z-20 mt-auto')">
            <h1
              :class="
                cn(
                  'text-4xl font-extrabold tracking-tight text-raisin-black',
                  'mt-10 font-mono',
                  'lg:mt-16 lg:text-[58px] lg:leading-tight'
                )
              "
            >
              Join the World’s Most-Loved Social Storytelling Platform!
            </h1>

            <blockquote
              :class="cn('mt-4 space-y-2 max-w-full', 'md:mt-5 md:max-w-[90%]')"
            >
              <p :class="cn('text-lg text-quartz font-medium', 'lg:text-xl')">
                Create an account to explore interesting articles, connect with
                like-minded people, and share your own stories.
              </p>
            </blockquote>
          </div>

          <figure class="flex justify-center relative z-20 mt-auto">
            <NuxtImg
              src="/images/illustration-register.svg"
              alt="storytime-illustration"
              loading="lazy"
              :class="cn('h-[400px] w-auto inline-block')"
            />
          </figure>
        </div>
      </div>

      <div :class="cn('max-w-[90%] mx-auto w-full', 'lg:max-w-[70%] lg:p-5')">
        <UserAuthFormRegister />
      </div>
    </section>
  </LayoutsSEOLayout>
</template>
