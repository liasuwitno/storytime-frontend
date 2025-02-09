<template>
  <LayoutsCommonLayout container="lg">
    <div :class="cn('mt-28')">
      <Back urlBack="/profile" title="Write Story" />

      <section class="mt-10">
        <form>
          <div class="form-control space-y-2 mb-7">
            <UiFormLabel class="text-quartz">Title</UiFormLabel>
            <UiInput
              type="text"
              :class="cn('py-6')"
              placeholder="Enter a story title"
              required
            />
          </div>

          <div class="form-control space-y-2 mb-7">
            <UiFormLabel class="text-quartz">Category</UiFormLabel>
            <UiInput
              type="text"
              :class="cn('py-6')"
              placeholder="Enter a story title"
              required
            />
          </div>

          <div class="form-control space-y-2 mb-7">
            <UiFormLabel class="text-quartz">Content</UiFormLabel>
            <UiInput
              type="text"
              :class="cn('py-6')"
              placeholder="Enter a story title"
              required
            />
          </div>

          <div class="max-w-full md:max-w-[50%]">
            <div class="form-control space-y-2 mb-7">
              <UiFormLabel class="text-quartz">Cover Image</UiFormLabel>
              <FilePond
                name="test"
                ref="pond"
                class-name="my-pond"
                label-idle="Choose a image file or drag it here"
                allow-multiple="true"
                credit="true"
                max-files="5"
                accepted-file-types="image/jpeg, image/png, images/jpg, image/webp"
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
              @click="handleFilePondInit"
              >Cancel</UiButton
            >
            <UiButton
              size="default"
              variant="default"
              :class="cn('bg-olive-drab', 'hover:bg-olive-drab/90')"
              >Post Story</UiButton
            >
          </div>
        </form>
      </section>
    </div>
  </LayoutsCommonLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

import vueFilePond from "vue-filepond";

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize
);

const handleFilePondInit = () => {
  console.log("FilePond has initialized");
};
</script>
<style>
.filepond--credits {
  display: none !important;
}
</style>
