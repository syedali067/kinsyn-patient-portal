<script lang="ts" setup>
import type { Editor } from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import { Underline } from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { useEditor, EditorContent, Extension } from '@tiptap/vue-3';
import { watch } from 'vue';

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    disabled?: boolean;
    fieldClass?: string;
  }>(),
  {
    size: 'md',
    placeholder: '',
    disabled: false,
    fieldClass: '',
  },
);

const emit = defineEmits<{
  sendMessage: [value: void];
}>();

const model = defineModel({ default: '' });

const KeyboardHandler = Extension.create({
  name: 'keyboardHandler',
});

const editor = useEditor({
  content: model.value,
  editorProps: {
    attributes: {
      class: `w-full text-14 rounded-4 p-16 pr-48 border border-ash focus-visible:outline-2 outline-beige -outline-offset-1 overflow-y-auto prose max-w-full ${props.fieldClass}`,
    },
  },
  onUpdate: ({ editor }: { editor: Editor }) => {
    if (editor.isEmpty) {
      model.value = '';
    } else {
      model.value = editor.getHTML();
    }
  },
  extensions: [
    StarterKit.configure({
      italic: {},
      bold: {},
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
    Underline.configure({
      HTMLAttributes: {
        class: 'underline',
      },
    }),
    KeyboardHandler.extend({
      addKeyboardShortcuts() {
        return {
          Enter: () => {
            if (this.editor.isEmpty) {
              return false;
            }
            emit('sendMessage');
            return true;
          },
          'Mod-Enter': () => {
            this.editor.commands.setHardBreak();
            return true;
          },
        };
      },
    }),
  ],
});

watch(model, (newValue) => {
  if (newValue === '' && editor.value) {
    editor.value.commands.clearContent();
  }

  if (newValue && editor.value) {
    editor.value.commands.setContent(newValue, false, { preserveWhitespace: 'full' });
  }
});
</script>

<template>
  <div class="relative w-full min-w-0" data-testpl="base-editor">
    <EditorContent
      v-if="editor"
      :editor="editor"
      class="editor min-w-0"
      data-testpl="base-editor-content"
    />

    <span
      v-if="$slots.append"
      class="absolute right-24 bottom-16 shrink-0"
      data-testpl="base-editor-append-slot"
    >
      <slot name="append" />
    </span>
  </div>
</template>

<style scoped>
@reference '@/assets/css/main.css';

.editor {
  &:deep(.tiptap p.is-editor-empty:first-child::before) {
    @apply text-coal pointer-events-none float-left h-0 opacity-50 content-[attr(data-placeholder)];
  }
}
</style>
