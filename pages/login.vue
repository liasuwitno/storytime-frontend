<script setup lang="ts">
import UserAuthFormLogin from "@/components/modules/Authentication/AuthLogin.vue";
</script>

<template>
  <section
    :class="
      cn(
        'container relative min-h-screen grid grid-cols-1 flex-col items-center justify-center',
        'lg:max-w-none lg:px-0 lg:grid-cols-2'
      )
    "
  >
    <div :class="cn('p-3 h-full block select-none', 'lg:p-5')">
      <div
        :class="
          cn('relative flex h-full flex-col bg-white p-10 text-raisin-black')
        "
      >
        <NuxtLink to="/" class="relative z-20">
          <NuxtImg
            src="/images/storytime.png"
            :class="cn('h-11')"
            alt="storytime"
          />
        </NuxtLink>

        <div
          :class="
            cn(
              'max-w-[90%] w-full mx-auto flex flex-col justify-center h-full',
              'lg:max-w-[60%]'
            )
          "
        >
          <UserAuthFormLogin />
        </div>
      </div>
    </div>

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

        <div :class="cn('relative z-20 mt-auto')">
          <h1
            :class="
              cn(
                'text-4xl font-extrabold tracking-tight text-raisin-black',
                'mt-10 font-mono',
                'lg:mt-16 lg:text-[58px] lg:leading-[1.2]'
              )
            "
          >
            Welcome Back to <br class="hidden md:block" />
            Story Time!
          </h1>

          <blockquote
            :class="cn('mt-4 space-y-2 max-w-full', 'md:mt-5 md:max-w-[90%]')"
          >
            <p :class="cn('text-lg text-quartz font-medium', 'lg:text-xl')">
              Dive back into captivating stories, follow your favorite authors,
              and continue sharing your own tales.
            </p>
          </blockquote>
        </div>

        <figure class="flex justify-center relative z-20 mt-auto">
          <NuxtImg
            src="/images/illustration-login.svg"
            alt="storytime-illustration"
            loading="lazy"
            :class="cn('h-[400px] w-auto inline-block')"
          />
        </figure>
      </div>
    </div>
  </section>
</template>
