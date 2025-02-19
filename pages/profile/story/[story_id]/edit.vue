<template>
  <LayoutsSEOLayout title="Story Edit">
    <LayoutsCommonLayout container="lg">
      <div :class="cn('mt-28')">
        <Back urlBack="/profile" title="Edit Story" />

        <section class="mt-10">
          <form @submit.prevent="submitStory">
            <UiInput
              hasLabel
              type="text"
              label="Title"
              placeholder="Enter a story title"
              :wrapperClassName="cn('mb-6')"
              :inputClass="cn('py-6 font-medium text-base')"
              :disabled="isSubmitting || isLoadingStory"
              v-model="formStoryData.title"
              isRequired
            />

            <div :class="cn('form-control space-y-2 mb-6')">
              <UiFormLabel class="text-quartz"> Category </UiFormLabel>

              <UiSelect
                :disabled="
                  isLoadingCategories || isSubmitting || isLoadingStory
                "
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
                :disabled="isSubmitting || isLoadingStory"
              />
            </div>

            <div
              :class="cn('max-w-full grid grid-cols-1 gap-6', 'md:grid-cols-2')"
            >
              <div class="form-control space-y-2 mb-7 w-full">
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

              <div class="form-control space-y-2 mb-7 w-full">
                <UiFormLabel class="text-quartz">Preview Images</UiFormLabel>

                <div
                  v-if="formStoryData.previewImages.length > 0"
                  :class="cn('grid grid-cols-2 gap-4', 'md:grid-cols-3')"
                >
                  <div
                    v-for="(story, index) in formStoryData.previewImages"
                    :key="index"
                    class="relative"
                  >
                    <NuxtImg
                      :src="story?.urls"
                      :alt="'Preview-Image- ' + index"
                      class="w-full h-full object-cover rounded-lg"
                    />

                    <button
                      type="button"
                      @click.prevent="removePreviewImage(index)"
                      :class="
                        cn(
                          'flex items-center justify-center',
                          'absolute top-2 right-2 bg-white/80 hover:bg-white size-6 rounded-sm'
                        )
                      "
                    >
                      <X :size="16" />
                    </button>

                    <p
                      :class="
                        cn('text-xs font-semibold text-raisin-black mt-2')
                      "
                    >
                      {{ index === 0 ? "Cover Image" : "Preview Image" }}
                    </p>
                  </div>
                </div>

                <div
                  v-else
                  :class="cn('grid grid-cols-1 gap-4', 'md:grid-cols-2')"
                >
                  <p :class="cn('text-xs font-semibold text-quartz')">
                    No preview images available
                  </p>
                </div>
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
                :disabled="isSubmitting"
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

                {{ isSubmitting ? "Processing..." : "Update Story" }}
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
  type StoryResponseDetail,
} from "~/composables/services/useStoryService";
import { LoaderCircle, X } from "lucide-vue-next";

const route = useRoute();

const { getCookies } = useCookies();
const token = getCookies("session");

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize
);

const { story_id: storyId } = route.params;

const pond = ref<any>(null);
const editor = ref<any>(null);
const currentStoryId = ref<string>("");
const categories = ref<CategoriesResponse[]>([]);

const isSubmitting = ref<boolean>(false);
const isLoadingStory = ref<boolean>(false);
const isLoadingCategories = ref<boolean>(false);

const { updateStory, getStoryBySlug } = useStoryService();
const { uploadFileSingleLink } = useUploadFileService();
const { getCategories: getAllCategories } = useCategoryService();

const { showToast } = useCustomToastify();

const formStoryData = reactive({
  title: "",
  body: "",
  identifier: "story",
  category_id: "",
  images: [] as UploadFileResponse[],
  previewImages: [] as UploadFileResponse[],
});

const initializeStoryData = async (): Promise<void> => {
  try {
    isLoadingStory.value = true;

    const response = await getStoryBySlug(storyId as string);

    if (response.code === CODE_OK) {
      const data = response?.data.story as StoryResponseDetail["story"];

      currentStoryId.value = data.story_id ?? "";
      formStoryData.title = data.title ?? "";
      formStoryData.body = data.content ?? "";
      formStoryData.category_id = String(data.category_id ?? "");
      formStoryData.previewImages = data.images?.map((image) => ({
        urls: image.url,
        identifiers: image.identifier,
      }));

      if (editor.value) {
        editor.value.commands.setContent(data.content);
      }
    }

    isLoadingStory.value = false;
  } catch (error) {
    console.error({ error });
  } finally {
    isLoadingStory.value = false;
  }
};

const removePreviewImage = (index: number) => {
  formStoryData.previewImages = formStoryData.previewImages.filter(
    (_, i) => i !== index
  );
};

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
  const newImages = [
    ...(formStoryData?.previewImages?.map((image) => image.urls) ?? []),
    ...(formStoryData?.images?.map((image) => image.urls) ?? []),
  ];

  return {
    body: formStoryData?.body ?? "",
    images: newImages,
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

    const response = await updateStory(payload, currentStoryId.value);

    if (response?.code === CODE_OK) {
      showToast("✅ Story updated successfully", {
        autoClose: 3000,
        position: "top-center",
        redirectPath: "/profile",
      });
    } else {
      showToast("❌ Story updated failed", {
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

const initialize = async () => {
  await getCategories();

  if (storyId) {
    await nextTick();
    await initializeStoryData();
  }
};

onMounted(initialize);
</script>

<style scoped>
.filepond--credits {
  display: none !important;
}
</style>
