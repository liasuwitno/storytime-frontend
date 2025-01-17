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

  <div :class="cn('flex flex-col space-y-5 select-none', $attrs.class ?? '')">
    <Form method="post" @submit="onSubmit">
      <UiInput
        hasLabel
        type="text"
        label="Name"
        placeholder="Enter your name"
        :inputClass="cn('py-6 font-medium text-base')"
        :wrapperClassName="cn('mb-6')"
        v-model="formData.fullname"
        isRequired
      />

      <UiInput
        hasLabel
        type="text"
        label="Username"
        placeholder="Enter your username"
        :inputClass="cn('py-6 font-medium text-base')"
        :wrapperClassName="cn('mb-6')"
        v-model="formData.username"
        isRequired
      />

      <UiInput
        hasLabel
        type="email"
        label="Email"
        placeholder="Enter your email"
        :inputClass="cn('py-6 font-medium text-base')"
        :wrapperClassName="cn('mb-6')"
        v-model="formData.email"
        isRequired
      />

      <UiInput
        hasLabel
        hasPassword
        label="Password"
        placeholder="Enter your chosen password"
        :inputClass="cn('py-6 font-medium text-base')"
        :wrapperClassName="cn('mb-6')"
        v-model="formData.password"
        isRequired
      />

      <UiInput
        hasLabel
        hasPassword
        label="Confirm Password"
        placeholder="Re-enter your chosen password"
        :inputClass="cn('py-6 font-medium text-base')"
        :wrapperClassName="cn('mb-6')"
        v-model="formData.confirmPassword"
        isRequired
      />

      <div class="grid gap-2">
        <UiButton
          type="submit"
          size="default"
          variant="default"
          :class="cn('bg-olive-drab h-12 text-base', 'hover:bg-olive-drab/90')"
        >
          Create Account
        </UiButton>
      </div>
    </Form>

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
import type { RegisterPayload } from "@/composables/services/useAuthService";

import { Form } from "vee-validate";
import * as z from "zod";

import { ref, reactive } from "vue";

const isLoading = ref(false);

const formData = reactive({
  fullname: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// const getPayloads = (): RegisterPayload => {
//   return {
//     fullname: formData.name,
//     username: String(formData.username)?.toLowerCase(),
//     email: String(formData.email)?.toLowerCase(),
//     password: formData.password,
//     password_confirmation: formData.confirmPassword,
//   };
// };

const onSubmit = async (): Promise<void> => {
  try {
    isLoading.value = true;

    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.error({ error });
  }
};
</script>
