<script setup lang="ts">
import DOMPurify, { type Config } from 'dompurify';
import { ref } from 'vue';

withDefaults(
  defineProps<{
    tag?: string;
    text?: string | null;
    options?: Config;
  }>(),
  {
    tag: 'span',
    text: '',
    options: undefined,
  },
);

const element = ref<HTMLElement>();

defineExpose({
  element,
});
</script>

<template>
  <!-- eslint-disable vue/no-v-text-v-html-on-component -->
  <component :is="tag" ref="element" v-html="text ? DOMPurify.sanitize(text, options) : ''" />
  <!-- eslint-enable vue/no-v-text-v-html-on-component -->
</template>
