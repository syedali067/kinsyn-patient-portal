<script setup lang="ts">
import IconClip from '@/assets/icons/clip.svg?component';
import BaseSpinner from '@/components/BaseSpinner/BaseSpinner.vue';
import { breakpointsTailwind, useBreakpoints, useDropZone } from '@vueuse/core';
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    fileSrc?: string | null;
    loading?: boolean;
    allowedTypes: {
      values: string[];
      types: string[];
    };
  }>(),
  {
    fileSrc: null,
    loading: false,
  },
);

const emit = defineEmits<{
  upload: [value: File[]];
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const isValidated = ref(false);
const dropZoneRef = ref<HTMLDivElement | null>(null);
const { isOverDropZone } = useDropZone(dropZoneRef, {
  dataTypes: props.allowedTypes.values,
  onDrop: onDrop,
});

function onDrop(files: File[] | null) {
  isValidated.value = false;

  if (files) {
    emit('upload', files);
  }
}

const addFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files: FileList | null = target.files;

  if (files) {
    const filesArray = Array.from(files);
    target.value = '';
    emit('upload', filesArray);
  }
};
</script>

<template>
  <div>
    <figure
      v-if="props.fileSrc && !loading"
      class="rounded-8 h-180 items-center justify-center overflow-hidden border border-gray-200"
      data-testpl="upload-document-figure"
    >
      <img
        v-if="props.fileSrc"
        :src="props.fileSrc"
        alt="document"
        class="size-full bg-gray-50 object-contain object-center"
        data-testpl="upload-document-image"
      />
    </figure>

    <label
      v-else
      ref="dropZoneRef"
      class="group rounded-8 bg-bone/50 hover:bg-bone relative flex h-180 cursor-pointer flex-col items-center justify-center gap-24 p-16"
      :class="{
        'outline-error/50 outline-1': !isOverDropZone && isValidated,
        'outline-success/50 outline-1': isOverDropZone && isValidated,
      }"
      data-testpl="upload-document-label"
      @dragenter.stop="isValidated = true"
      @dragleave.stop="isValidated = false"
    >
      <span
        v-if="loading"
        class="pointer-events-none absolute inset-0 flex items-center justify-center"
        data-testpl="upload-document-loading"
      >
        <BaseSpinner class="size-20" />
      </span>

      <template v-else>
        <IconClip class="text-coal group-hover:text-beige pointer-events-none" />

        <div class="pointer-events-none flex flex-col items-center">
          <input
            type="file"
            class="hidden"
            data-testpl="upload-document-input"
            :accept="allowedTypes.values.join(',')"
            @change="addFile"
          />

          <span class="flex flex-col items-center justify-center gap-8 text-center">
            <span class="text-14 lg:text-12 font-medium">
              <span v-if="greaterOrEqualLg" class="mr-2">{{ $t('dragYourFileHereOr') }}</span>
              <span class="text-link-text lg:lowercase">{{ $t('clickToUpload') }}</span>
            </span>

            <span
              v-if="allowedTypes.types.length"
              class="text-10 text-disabled-text"
              data-testpl="upload-document-supported-formats"
            >
              {{ $t('supportedFormats') }}:
              <span class="uppercase" data-testpl="upload-document-supported-formats-value">
                {{ allowedTypes.types.join(', ') }}
              </span>
            </span>
          </span>
        </div>
      </template>
    </label>
  </div>
</template>
