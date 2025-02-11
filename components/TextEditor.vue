<template>
  <div>
    <section
      v-if="editor"
      class="buttons text-gray-700 flex items-center flex-wrap gap-x-4 border-t border-l border-r border-gray-400 p-4"
    >
      <button
        type="button"
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'bg-gray-200 rounded': editor.isActive('bold') }"
        class="p-1"
      >
        <BoldIcon :size="20" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'bg-gray-200 rounded': editor.isActive('italic') }"
        class="p-1"
      >
        <ItalicIcon :size="20" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleUnderline().run()"
        :class="{ 'bg-gray-200 rounded': editor.isActive('underline') }"
        class="p-1"
      >
        <UnderlineIcon :size="20" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{
          'bg-gray-200 rounded': editor.isActive('heading', { level: 1 }),
        }"
        class="p-1"
      >
        <Heading1Icon :size="20" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{
          'bg-gray-200 rounded': editor.isActive('heading', { level: 2 }),
        }"
        class="p-1"
      >
        <Heading2Icon :size="20" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-gray-200 rounded': editor.isActive('bulletList') }"
        class="p-1"
      >
        <ListIcon :size="20" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'bg-gray-200 rounded': editor.isActive('orderedList') }"
        class="p-1"
      >
        <ListOrderedIcon :size="20" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'bg-gray-200 rounded': editor.isActive('blockquote') }"
        class="p-1"
      >
        <TextQuoteIcon :size="20" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleCode().run()"
        :class="{ 'bg-gray-200 rounded': editor.isActive('code') }"
        class="p-1"
      >
        <CodeIcon :size="20" />
      </button>
      <button
        type="button"
        class="p-1 disabled:text-gray-400"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()"
      >
        <UndoIcon :size="20" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()"
        class="p-1 disabled:text-gray-400"
      >
        <RedoIcon :size="20" />
      </button>
    </section>
    <EditorContent :editor="editor" />
  </div>
</template>
<script setup>
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  BoldIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  RedoIcon,
  TextQuoteIcon,
  UnderlineIcon,
  UndoIcon,
} from "lucide-vue-next";

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
  extensions: [StarterKit, Underline],
  editorProps: {
    attributes: {
      class:
        "border border-gray-400 p-4 min-h-[12rem] max-h-[12rem] overflow-y-auto outline-none prose max-w-none",
    },
  },
});
</script>
<style lang=""></style>
