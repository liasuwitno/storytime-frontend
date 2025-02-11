<template>
  <div
    class="filepond-container mb-2"
    :style="{ width: 180 + 'px', height: 180 + 'px' }"
  >
    <FilePond
      name="file"
      ref="pond"
      max-file-size="512KB"
      :accepted-file-types="[
        'image/png',
        'image/jpeg',
        'image/webp',
        'image/jpg',
      ]"
      :label-idle="labelText"
      :image-preview-height="150"
      :image-crop-aspect-ratio="'1:1'"
      :style-panel-layout="'compact circle'"
      :style-load-indicator-position="'center bottom'"
      :style-button-remove-item-position="'center bottom'"
      :allow-image-edit="true"
      :image-edit-allow-edit="true"
      :image-edit-instant-edit="false"
      :server="{
        process: {
          url: `${uploadFileSingleLink('users')}`,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          ondata: (formData: FormData) => {
            formData.append('identifier', 'users');
            return formData;
          },
          onload: (response: any) => {
            const res = JSON.parse(response);
            const url = res?.data?.urls;

            if (url) {
              emit('update:modelValue', url);
              return url;
            }

            return [];
          },
        },
      }"
    />
  </div>
</template>

<script setup lang="ts">
import vueFilePond from "vue-filepond";
import { useUploadFileService } from "~/composables/services/useUploadFileService";

import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const { uploadFileSingleLink } = useUploadFileService();

const FilePond = vueFilePond(
  FilePondPluginFileEncode,
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform
);

const { getCookies } = useCookies();
const token = getCookies("session");

const pond = ref<any>(null);

const labelText =
  'Drag & Drop your picture or <span class="filepond--label-action">Browse</span>';
</script>

<style scoped>
:deep(.filepond--drop-label) {
  color: #4c4e53;
}

:deep(.filepond--label-action) {
  text-decoration-color: #babdc0;
}

:deep(.filepond--panel-root) {
  background-color: #edf0f4;
}

:deep(.filepond--image-edit-button) {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}

:deep(.filepond--file-action-button.filepond--action-remove-item) {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  top: auto !important;
  right: auto !important;
  margin: 0 0 8px 0;
}

:deep(.filepond--action-remove-item) {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}

.filepond--credits {
  display: none !important;
}
</style>
