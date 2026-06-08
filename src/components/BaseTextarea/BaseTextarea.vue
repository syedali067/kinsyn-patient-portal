<script lang="ts" setup>
import { ref, type Ref } from 'vue';

withDefaults(
  defineProps<{
    placeholder?: string;
    disabled?: boolean;
    error?: string | Ref<string>;
    fieldClass?: string;
    rows?: number;
  }>(),
  {
    placeholder: '',
    disabled: false,
    error: '',
    fieldClass: '',
    rows: 2,
  },
);

const valueModel = defineModel<string>({ default: '' });
const focused = ref(false);
</script>

<template>
  <div class="flex flex-col gap-8">
    <textarea
      v-model="valueModel"
      class="text-14 placeholder:text-14 rounded-4 resize-none p-16 -outline-offset-1"
      :class="[
        {
          'placeholder:text-secondary-text': !disabled,
          'text-disabled-text placeholder:text-disabled-text': disabled,
          'border-error border': error,
          'border-ash border': !error,
          'outline-error outline-2': focused && error,
          'outline-beige outline-2': focused && !error,
          'bg-disabled-bg': disabled,
        },
        fieldClass,
      ]"
      :placeholder
      :disabled
      :rows
      @focus="focused = true"
      @blur="focused = false"
    />

    <p v-if="error" class="text-error text-12">
      {{ error }}
    </p>
  </div>
</template>
