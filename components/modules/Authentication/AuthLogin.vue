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
    <Form @submit="onSubmit">
      <Field name="email">
        <UiInput
          hasLabel
          type="text"
          label="Username/Email"
          placeholder="Enter your username or email"
          :inputClass="
            cn('py-6 font-medium text-base', {
              'border-red-500': !!errorMessage,
            })
          "
          :wrapperClassName="cn('mb-6')"
          :disabled="isLoading"
          v-model="formLoginData.email"
          isRequired
        />
      </Field>

      <Field name="password">
        <UiInput
          hasLabel
          hasPassword
          label="Password"
          placeholder="Enter your chosen password"
          :inputClass="
            cn('py-6 font-medium text-base', {
              'border-red-500': !!errorMessage,
            })
          "
          :wrapperClassName="cn('mb-6')"
          :hasError="!!errorMessage"
          v-model="formLoginData.password"
          :disabled="isLoading"
          :inputMessage="
            !!errorMessage
              ? errorMessage
              : 'Password must be at least 8 characters long'
          "
          isRequired
        />
      </Field>

      <div class="grid gap-2">
        <UiButton
          as="button"
          type="submit"
          size="default"
          variant="default"
          :disabled="isLoading || isDisabled"
          :class="
            cn(
              'bg-olive-drab h-12 text-base flex items-center',
              'hover:bg-olive-drab/90'
            )
          "
        >
          <LoaderCircle
            v-if="isLoading"
            :size="16"
            :stroke-width="3"
            :class="
              cn({
                'animate-spin': isLoading,
              })
            "
          />
          <span>{{ isLoading ? "Processing..." : "Login" }}</span>
        </UiButton>
      </div>
    </Form>

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
import { reactive } from "vue";

import {
  type LoginPayload,
  type LoginResponse,
  useAuthService,
} from "~/composables/services/useAuthService";
import type { ApiResponse } from "~/types/response";
import { useAuthenticationStore } from "~/stores/auth";
import { LoaderCircle } from "lucide-vue-next";

const isLoading = ref<boolean>(false);
const errorMessage = ref<string | null>(null);

const { login, getProfile } = useAuthService();

const authenticationStore = useAuthenticationStore();
const formLoginData = reactive({
  email: "",
  password: "",
});

const getPayload = (): LoginPayload => {
  return {
    email: String(formLoginData.email)?.toLowerCase(),
    password: formLoginData.password,
  };
};

const clearForm = (): void => {
  formLoginData.email = "";
  formLoginData.password = "";
};

const performLogin = async (payload: LoginPayload) => {
  try {
    const response = await login(payload);
    return response;
  } catch (error: any) {
    const dataError = error?.data as ApiResponse<null>;
    errorMessage.value = dataError?.message ?? "";

    console.error({ error });
    throw error;
  }
};

const handleAuthentication = (result: LoginResponse): void => {
  const expiresIn = result
    ? new Date(result?.session?.expires_at).getTime()
    : 0;

  authenticationStore.setCredentials({
    session_in: expiresIn,
    token: result?.token ?? "",
  });
};

const fetchUserProfile = async (): Promise<void> => {
  const responseProfile = await getProfile();
  const dataProfile = responseProfile?.data;

  if (dataProfile) {
    authenticationStore.setProfile(dataProfile);

    clearForm();
    navigateTo("/");
  }
};

const onSubmit = async (event: Event): Promise<void> => {
  event.preventDefault();

  const payload = getPayload();

  try {
    isLoading.value = true;

    const response = await performLogin(payload);

    if (response?.code === CODE_OK) {
      const result = response?.data;

      if (result?.token) {
        handleAuthentication(result);
        await fetchUserProfile();
      }
    }
  } catch (error) {
    isLoading.value = false;
  } finally {
    isLoading.value = false;
  }
};

const isDisabled = computed(() => {
  return (
    !formLoginData.email ||
    !formLoginData.password ||
    formLoginData.password.length < 8
  );
});
</script>
