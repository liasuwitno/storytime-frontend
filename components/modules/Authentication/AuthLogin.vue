<template>
  <h2
    :class="
      cn(
        'text-2xl font-bold text-raisin-black tracking-tighter',
        'md:text-4xl md:mb-10'
      )
    "
  >
    Login
  </h2>

  <div :class="cn('flex flex-col space-y-5', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <UiInput
        hasLabel
        type="text"
        label="Email"
        placeholder="Enter your email"
        :inputClass="cn('py-6 font-medium')"
        :wrapperClassName="cn('mb-6')"
        :modelValue="formData.email"
        isRequired
      />

      <UiInput
        hasLabel
        hasPassword
        label="Password"
        placeholder="Enter your chosen password"
        :inputClass="cn('py-6 font-medium')"
        :wrapperClassName="cn('mb-6')"
        :modelValue="formData.password"
        isRequired
      />

      <div class="grid gap-2">
        <UiButton
          type="button"
          size="default"
          variant="default"
          :class="cn('bg-olive-drab h-12 text-base', 'hover:bg-olive-drab/90')"
        >
          Login
        </UiButton>
      </div>
    </form>

    <div class="relative">
      <p>
        Don't have an account yet?
        <NuxtLink
          to="/register"
          class="text-olive-drab font-semibold hover:underline"
        >
          Register
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

import { Button } from "~/components/ui/button";

const formData = reactive({
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const isLoading = ref(false);
async function onSubmit(event: Event) {
  event.preventDefault();
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
  }, 3000);
}
</script>
