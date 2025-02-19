<!-- error.vue -->
<template>
  <div v-if="error.statusCode === 404">
    <LayoutsSEOLayout
      title="Oops! The page you are looking for does not exist."
    >
      <LayoutsCommonLayout container="lg">
        <section
          :class="cn('min-h-screen flex items-center justify-center', 'w-full')"
        >
          <div :class="cn('grid grid-cols-2 md:grid-cols-1 gap-4 w-full')">
            <figure class="flex justify-center relative z-20 mt-auto">
              <NuxtImg
                src="/images/illustration-not-found.svg"
                alt="not-found-illustration"
                loading="lazy"
                :class="cn('h-[400px] w-auto inline-block')"
              />
            </figure>

            <div :class="cn('p-3 h-full text-center')">
              <h1
                :class="
                  cn(
                    'font-extrabold tracking-tight text-raisin-black',
                    'mt-10 font-mono leading-none',
                    'lg:mt-6'
                  )
                "
              >
                404
              </h1>

              <h6
                :class="
                  cn(
                    'font-semibold tracking-tight text-9xl text-raisin-black',
                    'font-mono capitalize mb-8'
                  )
                "
              >
                Page not found
              </h6>

              <p
                class="font-medium mb-8 text-base text-quartz max-w-[90%] mx-auto"
              >
                Oops! It looks like this page doesn't exist. Please check the
                URL or return to the homepage.
              </p>

              <UiButton
                type="button"
                variant="default"
                size="lg"
                :class="cn('bg-olive-drab text-base', 'hover:bg-olive-drab/90')"
                @click="handleReturn"
              >
                Back To Home
              </UiButton>
            </div>
          </div>
        </section>
      </LayoutsCommonLayout>
    </LayoutsSEOLayout>
  </div>
</template>

<script setup>
const error = useError();
const router = useRouter();

const handleReturn = () => {
  clearError();
  router.push("/");
};
</script>

<style scoped>
h1 {
  font-size: 160px;
}

h6 {
  font-size: 44px;
}
</style>
