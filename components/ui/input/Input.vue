<script setup lang="ts">
import { cn } from "@/utils";
import { useVModel } from "@vueuse/core";
import { Eye, EyeClosed } from "lucide-vue-next";

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  placeholder?: string;
  type?: string;
  inputClass?: string;
  iconLeft?: any;
  iconRight?: any;

  name?: string;
  hasLabel?: boolean;
  isRequired?: boolean;
  label?: string;
  wrapperClassName?: string;
  hasPassword?: boolean;

  hasError?: boolean;
  inputMessage?: string;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue ?? "",
});

const showPassword = ref(false);

const togglePassword = (): void => {
  showPassword.value = !showPassword.value;
};

const inputType = computed(() => props.type || "text");
</script>

<template>
  <div :class="cn('form-control space-y-2', props.wrapperClassName)">
    <UiFormLabel v-if="props.hasLabel" class="text-quartz">
      {{ props.label }}
    </UiFormLabel>

    <div class="relative pb-1">
      <template v-if="props.iconLeft">
        <span
          class="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          <component :is="props.iconLeft" />
        </span>
      </template>

      <input
        :name="props.name"
        v-model="modelValue"
        :class="
          cn(
            'flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
            props.inputClass
          )
        "
        :placeholder="props.placeholder"
        :type="
          props.hasPassword ? (showPassword ? 'text' : 'password') : inputType
        "
        :required="props.isRequired"
      />

      <template v-if="props.hasPassword">
        <button
          type="button"
          class="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500"
          @click="togglePassword"
        >
          <component :is="showPassword ? Eye : EyeClosed" />
        </button>
      </template>

      <template v-if="props.iconRight">
        <span
          class="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          <component :is="props.iconRight" />
        </span>
      </template>
    </div>

    <span
      v-if="props.inputMessage"
      :class="
        cn('text-sm font-semibold tracking-tight pt-20', {
          'text-red-500': props.hasError,
          'text-gray-600': !props.hasError,
        })
      "
    >
      {{ props.inputMessage }}
    </span>
  </div>
</template>
