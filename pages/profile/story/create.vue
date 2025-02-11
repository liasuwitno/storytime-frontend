<template>
  <LayoutsSEOLayout title="Story Create">
    <LayoutsCommonLayout container="lg">
      <div :class="cn('mt-28')">
        <Back urlBack="/profile" title="Write Story" />

        <section class="mt-10">
          <form @submit.prevent="submitStory">
            <UiInput
              hasLabel
              type="text"
              label="Title"
              placeholder="Enter a story title"
              :wrapperClassName="cn('mb-6')"
              :inputClass="cn('py-6 font-medium text-base')"
              :disabled="isSubmitting"
              v-model="formStoryData.title"
              isRequired
            />

            <div :class="cn('form-control space-y-2 mb-6')">
              <UiFormLabel class="text-quartz"> Category </UiFormLabel>

              <UiSelect
                :disabled="isLoadingCategories || isSubmitting"
                v-model="formStoryData.category_id"
              >
                <UiSelectTrigger :class="cn('py-6 font-medium text-base')">
                  <UiSelectValue
                    :placeholder="
                      isLoadingCategories
                        ? 'Please wait until the categories are loaded'
                        : 'Select a category'
                    "
                  />
                </UiSelectTrigger>

                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-for="(category, index) in categories"
                      :value="String(category?.id)"
                      :key="index"
                      :class="
                        cn('font-semibold text-base font-sans cursor-pointer')
                      "
                    >
                      {{ category?.name ?? "" }}
                    </UiSelectItem>
                  </UiSelectGroup>
                </UiSelectContent>
              </UiSelect>
            </div>

            <div :class="cn('form-control space-y-2 mb-6')">
              <UiFormLabel class="text-quartz"> Content </UiFormLabel>
              <TextEditor
                v-model="formStoryData.body"
                :disabled="isSubmitting"
              />
            </div>

            <div class="max-w-full md:max-w-[50%]">
              <div class="form-control space-y-2 mb-7">
                <UiFormLabel class="text-quartz">Cover Image</UiFormLabel>
                <FilePond
                  name="file"
                  ref="pond"
                  class-name="my-pond"
                  label-idle="Choose or Drag images here, Max 512 kb"
                  allow-multiple="true"
                  accepted-file-types="image/jpeg, image/png, images/jpg, image/webp"
                  max-file-size="512KB"
                  :server="{
                    url: '',
                    process: {
                      url: `${uploadFileSingleLink('story')}`,
                      method: 'POST',
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                      ondata: (formData: FormData) => {
                        formData.append('identifier', 'story');

                        return formData;
                      },
                      onload: (response: any) => {
                        const res = JSON.parse(response);

                        const url = res?.data?.urls;

                        if (url) {
                          formStoryData.images = [
                            ...formStoryData.images,
                            { urls: url, identifiers: 'story' },
                          ];
                          return url;
                        }

                        return [];
                      },
                    },
                  }"
                  :disabled="isSubmitting"
                />
              </div>
            </div>

            <div :class="cn('flex items-center justify-start space-x-4 mt-12')">
              <UiButton
                variant="outline"
                size="default"
                :class="
                  cn(
                    'text-olive-drab border-olive-drab border-2',
                    'hover:text-white hover:bg-olive-drab'
                  )
                "
                @click="handleCancel"
                :disabled="isSubmitting"
              >
                Cancel
              </UiButton>

              <UiButton
                type="submit"
                size="default"
                variant="default"
                :class="
                  cn(
                    'bg-olive-drab flex items-center space-x-1',
                    'hover:bg-olive-drab/90'
                  )
                "
                :disabled="!isFormValid || isSubmitting"
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

                {{ isSubmitting ? "Processing..." : "Create Story" }}
              </UiButton>
            </div>
          </form>
        </section>
      </div>
    </LayoutsCommonLayout>
  </LayoutsSEOLayout>
</template>

<script setup lang="ts">
import vueFilePond from "vue-filepond";

import {
  useCategoryService,
  type CategoriesResponse,
} from "~/composables/services/useCategoryService";
import TextEditor from "~/components/TextEditor.vue";
import {
  useUploadFileService,
  type UploadFileResponse,
} from "~/composables/services/useUploadFileService";

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import {
  useStoryService,
  type StoryPayload,
} from "~/composables/services/useStoryService";
import { LoaderCircle } from "lucide-vue-next";

const { getCookies } = useCookies();
const token = getCookies("session");

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize
);

const pond = ref<any>(null);
const categories = ref<CategoriesResponse[]>([]);
const isSubmitting = ref<boolean>(false);
const isLoadingCategories = ref<boolean>(false);

const { createStory } = useStoryService();
const { uploadFileSingleLink } = useUploadFileService();
const { getCategories: getAllCategories } = useCategoryService();

const formStoryData = reactive({
  title: "",
  body: "",
  identifier: "story",
  category_id: "",
  images: [] as UploadFileResponse[],
});

const isFormValid = computed(() => {
  return (
    formStoryData.title.trim().length > 0 &&
    formStoryData.body.trim().length > 0 &&
    formStoryData.category_id !== "" &&
    formStoryData.images.length > 0
  );
});

const getCategories = async (): Promise<void> => {
  try {
    isLoadingCategories.value = true;
    if (categories.value.length > 0) return;

    const response = await getAllCategories();

    if (response?.code === CODE_OK) {
      categories.value = response.data?.map((category) => ({
        id: category.id,
        name: category.name,
      }));
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  } finally {
    isLoadingCategories.value = false;
  }
};

const getPayload = async (): Promise<StoryPayload> => {
  return {
    body: formStoryData?.body ?? "",
    images: formStoryData?.images?.map((image) => image.urls) ?? [],
    identifier: "story",
    title: formStoryData?.title ?? "",
    category_id:
      typeof formStoryData.category_id === "string"
        ? Number(formStoryData.category_id)
        : formStoryData.category_id,
  };
};

const submitStory = async (): Promise<void> => {
  const payload = await getPayload();

  try {
    isSubmitting.value = true;

    const response = await createStory(payload);

    if (response?.code === CODE_CREATED) {
      alert("Story created successfully");
      navigateTo("/profile");
    }

    isSubmitting.value = false;
  } catch (error) {
    console.error({ error });
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  if (pond.value) {
    pond.value.removeFiles();
  }

  formStoryData.images = [];
  formStoryData.title = "";
  formStoryData.body = "";
  formStoryData.category_id = "";

  navigateTo("/profile");
};

onMounted(async () => {
  if (!categories.value?.length) {
    await getCategories();
  }
});
</script>

<style scoped>
.filepond--credits {
  display: none !important;
}
</style>
