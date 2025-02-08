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
    <Form @submit="onSubmit">
      <UiInput
        hasLabel
        type="text"
        label="Name"
        placeholder="Enter your name"
        :inputClass="cn('py-6 font-medium text-base')"
        :wrapperClassName="cn('mb-6')"
        v-model="formRegisterData.fullname"
        isRequired
      />

      <UiInput
        hasLabel
        type="text"
        label="Username"
        placeholder="Enter your username"
        :inputClass="cn('py-6 font-medium text-base')"
        :wrapperClassName="cn('mb-6')"
        v-model="formRegisterData.username"
        isRequired
      />

      <UiInput
        hasLabel
        type="email"
        label="Email"
        placeholder="Enter your email"
        :inputClass="cn('py-6 font-medium text-base')"
        :wrapperClassName="cn('mb-6')"
        v-model="formRegisterData.email"
        isRequired
      />

      <UiInput
        hasLabel
        hasPassword
        label="Password"
        placeholder="Enter your chosen password"
        :inputClass="cn('py-6 font-medium text-base')"
        :wrapperClassName="cn('mb-6')"
        v-model="formRegisterData.password"
        isRequired
      />

      <UiInput
        hasLabel
        hasPassword
        label="Confirm Password"
        placeholder="Re-enter your chosen password"
        :inputClass="cn('py-6 font-medium text-base')"
        :wrapperClassName="cn('mb-6')"
        v-model="formRegisterData.confirmPassword"
        isRequired
      />

      <div class="grid gap-2">
        <UiButton
          type="submit"
          size="default"
          variant="default"
          :disabled="isDisabled || isLoading"
          :class="cn('bg-olive-drab h-12 text-base', 'hover:bg-olive-drab/90')"
        >
          {{ isLoading ? "Processing..." : "Create Account" }}
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
import {
  useAuthService,
  type RegisterPayload,
} from "~/composables/services/useAuthService";
import type { ApiResponse } from "~/types/response";

const isLoading = ref(false);

const { register } = useAuthService();

const formRegisterData = reactive({
  fullname: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const getPayload = (): RegisterPayload => {
  return {
    fullname: formRegisterData?.fullname,
    username: String(formRegisterData.username)?.toLowerCase(),
    email: String(formRegisterData.email)?.toLowerCase(),
    password: formRegisterData.password,
    password_confirmation: formRegisterData?.confirmPassword,
  };
};

const clearForm = (): void => {
  formRegisterData.fullname = "";
  formRegisterData.username = "";
  formRegisterData.email = "";
  formRegisterData.password = "";
  formRegisterData.confirmPassword = "";
};

const onSubmit = async (event: FormDataEvent): Promise<void> => {
  event.preventDefault();
  const payload = getPayload();

  try {
    isLoading.value = true;

    const response = await register(payload);

    if (response?.code === CODE_CREATED) {
      const result = response?.data;

      clearForm();
    }

    isLoading.value = false;
  } catch (error: any) {
    const dataError = error?.data as ApiResponse<null>;

    console.error({ error });
    isLoading.value = false;
  }
};

const isDisabled = computed(() => {
  return (
    !formRegisterData.email ||
    !formRegisterData.password ||
    formRegisterData.password.length < 8 ||
    !formRegisterData.fullname ||
    !formRegisterData.username
  );
});
</script>
