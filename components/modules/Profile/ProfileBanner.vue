<template>
  <section :class="cn('bg-[#F0F5ED]')">
    <div
      :class="
        cn(
          'max-w-6xl mx-auto flex items-center justify-start min-h-[45vh]',
          'pt-10'
        )
      "
    >
      <div
        v-if="!props.profile"
        class="w-full grid grid-cols-[20%_1fr_20%] items-center gap-4"
      >
        <UiSkeleton :class="cn('w-40 h-40 rounded-full')" />

        <div class="block space-y-2">
          <UiSkeleton :class="cn('w-48 h-8')" />
          <UiSkeleton :class="cn('w-56 h-6')" />
          <UiSkeleton :class="cn('w-96 h-14')" />
        </div>

        <div class="profile-cta">
          <UiSkeleton :class="cn('w-24 h-8')" />
        </div>
      </div>

      <div
        v-else
        class="w-full grid grid-cols-[20%_1fr_20%] items-center gap-4"
      >
        <div class="flex justify-center">
          <NuxtImg
            :src="
              props.profile?.avatar ??
              'https://via.assets.so/img.jpg?w=800&h=400&tc=#cecece&bg=#cecece'
            "
            class="w-40 h-40 rounded-full object-cover"
            alt="profile-avatar"
          />
        </div>

        <div class="block">
          <h1
            class="font-bold tracking-tight text-2xl leading-normal text-raisin-black line-clamp-1"
          >
            {{ props.profile?.fullname ?? "-" }}
          </h1>
          <p
            class="text-base font-medium text-raisin-black tracking-tight mt-1"
          >
            {{ props.profile?.email ?? "-" }}
          </p>
          <p
            class="text-quartz font-medium text-base leading-normal mt-4 line-clamp-3"
          >
            {{ props.profile?.bio ?? "-" }}
          </p>
        </div>

        <div class="profile-cta">
          <UiDialog v-model:open="isDialogOpen">
            <UiDialogTrigger as-child>
              <UiButton
                size="default"
                variant="default"
                :class="cn('bg-olive-drab', 'hover:bg-olive-drab/90')"
              >
                Edit Profile
              </UiButton>
            </UiDialogTrigger>

            <UiDialogContent class="sm:max-w-6xl">
              <UiDialogHeader>
                <UiDialogTitle
                  :class="
                    cn('text-2xl capitalize font-semibold text-raisin-black')
                  "
                  >Edit profile
                </UiDialogTitle>
              </UiDialogHeader>

              <form @submit.prevent="submitProfile">
                <div :class="cn('dialog-body grid grid-cols-2 gap-6')">
                  <div :class="cn('flex flex-col')">
                    <div v-if="formData.avatar && !isChangePicture">
                      <div class="flex items-center space-x-4">
                        <NuxtImg
                          :src="formData.avatar"
                          class="size-36 rounded-full object-cover mb-3"
                          alt="storytime"
                        />
                        <UiButton
                          variant="outline"
                          size="lg"
                          @click="isChangePicture = true"
                          :class="
                            cn(
                              'text-olive-drab text-base border-olive-drab border-2',
                              'hover:text-white hover:bg-olive-drab'
                            )
                          "
                        >
                          Change Picture
                        </UiButton>
                      </div>
                    </div>

                    <FilepondRounded v-else v-model="formData.newAvatar" />

                    <UiInput
                      hasLabel
                      type="text"
                      label="Name"
                      placeholder="Enter your fullname"
                      :inputClass="cn('py-6 font-medium text-base')"
                      :wrapperClassName="cn('mb-4')"
                      :disabled="isSubmitting"
                      v-model="formData.fullname"
                    />

                    <UiInput
                      hasLabel
                      type="email"
                      label="Email"
                      placeholder="Enter your email"
                      :inputClass="cn('py-6 font-medium text-base')"
                      :wrapperClassName="cn('mb-4')"
                      v-model="formData.email"
                      disabled
                    />

                    <UiInput
                      hasLabel
                      type="text"
                      label="About Me"
                      placeholder="Enter your bio"
                      :inputClass="cn('font-medium text-base h-24')"
                      :wrapperClassName="cn('mb-4')"
                      :disabled="isSubmitting"
                      v-model="formData.bio"
                    />
                  </div>

                  <div :class="cn('flex flex-col')">
                    <h2 :class="cn('text-2xl font-bold tracking-tight mb-7')">
                      Change Password
                    </h2>

                    <UiInput
                      hasLabel
                      hasPassword
                      label="Old Password"
                      placeholder="Enter your old password"
                      :inputClass="cn('py-6 font-medium text-base')"
                      :wrapperClassName="cn('mb-4')"
                      :disabled="isSubmitting"
                      v-model="formData.oldPassword"
                    />

                    <UiInput
                      hasLabel
                      hasPassword
                      label="New Password"
                      placeholder="Enter your new password"
                      :inputClass="cn('py-6 font-medium text-base')"
                      :wrapperClassName="cn('mb-4')"
                      :inputMessage="'Password must be at least 8 characters long'"
                      v-model="formData.newPassword"
                    />

                    <UiInput
                      hasLabel
                      hasPassword
                      label="Confirm New Password"
                      placeholder="Re-enter your new password"
                      :inputClass="cn('py-6 font-medium text-base')"
                      :wrapperClassName="cn('mb-4')"
                      :inputMessage="'Password must be at least 8 characters long'"
                      v-model="formData.confirmNewPassword"
                    />
                  </div>
                </div>

                <UiDialogFooter :class="cn('w-full')">
                  <div :class="cn('mr-auto flex items-center space-x-3 mt-10')">
                    <UiDialogClose asChild @click="isChangePicture = false">
                      <UiButton
                        variant="outline"
                        size="lg"
                        :disabled="isSubmitting"
                        :class="
                          cn(
                            'text-olive-drab text-base border-olive-drab border-2',
                            'hover:text-white hover:bg-olive-drab'
                          )
                        "
                      >
                        Cancel
                      </UiButton>
                    </UiDialogClose>

                    <UiButton
                      type="submit"
                      size="lg"
                      variant="default"
                      :disabled="isSubmitting"
                      :class="
                        cn(
                          'bg-olive-drab flex text-base items-center space-x-1',
                          'hover:bg-olive-drab/90'
                        )
                      "
                    >
                      <LoaderCircle
                        v-if="isSubmitting"
                        :size="16"
                        :stroke-width="3"
                        :class="
                          cn('flex-shrink-0', {
                            'animate-spin': isSubmitting,
                          })
                        "
                      />

                      {{ isSubmitting ? "Processing..." : "Update Profile" }}
                    </UiButton>
                  </div>
                </UiDialogFooter>
              </form>
            </UiDialogContent>
          </UiDialog>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  useAuthService,
  type ProfileResponse,
  type UpdateProfilePayload,
} from "~/composables/services/useAuthService";
import { LoaderCircle } from "lucide-vue-next";
import { useAuthenticationStore } from "~/stores/auth";

interface Props {
  profile: ProfileResponse | null;
}

const props = defineProps<Props>();

const store = useAuthenticationStore();
const profileUser = computed(() => store.userProfile);

const { updateProfile } = useAuthService();
const { showToast } = useCustomToastify();

const isDialogOpen = ref<boolean>(false);
const isChangePicture = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);

const formData = ref({
  fullname: "",
  email: "",
  bio: "",
  avatar: "",
  newAvatar: "",
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

const getPayload = (): UpdateProfilePayload => {
  return {
    fullname: formData.value.fullname,
    avatar: profileUser.value?.avatar
      ? isChangePicture.value
        ? formData.value.newAvatar
        : profileUser.value.avatar
      : formData.value.newAvatar,
    bio: formData.value.bio,
    old_password: formData.value.oldPassword,
    new_password: formData.value.newPassword,
    new_password_confirmation: formData.value.confirmNewPassword,
  };
};

watch(
  profileUser,
  (newValue) => {
    if (newValue) {
      formData.value = {
        ...formData.value,
        fullname: newValue.fullname ?? "",
        email: newValue.email ?? "",
        bio: newValue.bio ?? "",
        avatar: newValue.avatar ?? "",
      };
    }
  },
  { immediate: true, deep: true }
);

const submitProfile = async (): Promise<void> => {
  const payload = getPayload();

  try {
    isSubmitting.value = true;

    const response = await updateProfile(payload);

    if (response?.code === CODE_OK) {
      const isSuccess = await store.loadProfile();

      if (isSuccess) {
        isDialogOpen.value = false;
        isChangePicture.value = false;
      }

      showToast("✅ Successfully edit your profile", {
        autoClose: 3000,
        position: "top-center",
      });
    } else {
      showToast("❌ Successfully edit your profile", {
        autoClose: 3000,
        position: "top-center",
      });
    }

    isSubmitting.value = false;
  } catch (error) {
    console.error({ error });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
