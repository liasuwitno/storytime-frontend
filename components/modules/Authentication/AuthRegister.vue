<template>
  <h2
    :class="
      cn(
        'text-2xl font-bold text-raisin-black tracking-tighter',
        'md:text-4xl md:mb-10'
      )
    "
  >
    Create Account
  </h2>

  <div :class="cn('flex flex-col space-y-5', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <UiInput
        hasLabel
        type="text"
        label="Name"
        placeholder="Enter your name"
        :inputClass="cn('py-6 font-medium')"
        :wrapperClassName="cn('mb-6')"
        :modelValue="formData.name"
        isRequired
      />

      <UiInput
        hasLabel
        type="text"
        label="Username"
        placeholder="Enter your username"
        :inputClass="cn('py-6 font-medium')"
        :wrapperClassName="cn('mb-6')"
        :modelValue="formData.username"
        isRequired
      />

      <UiInput
        hasLabel
        type="email"
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

      <UiInput
        hasLabel
        hasPassword
        label="Confirm Password"
        placeholder="Re-enter your chosen password"
        :inputClass="cn('py-6 font-medium')"
        :wrapperClassName="cn('mb-6')"
        :modelValue="formData.confirmPassword"
        isRequired
      />

      <div class="grid gap-2">
        <UiButton
          type="button"
          size="default"
          variant="default"
          :class="cn('bg-olive-drab h-12 text-base', 'hover:bg-olive-drab/90')"
        >
          Create Account
        </UiButton>
      </div>
    </form>

    <div class="relative">
      <p>
        Already have an account?
        <NuxtLink
          to="/login"
          class="text-olive-drab font-semibold hover:underline"
        >
          Login
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
