<script setup lang="ts">
import StencilCrop from './StencilCrop.vue';
import IconClip from '@/assets/icons/clip.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import { useUploadValidation } from '@/composables/useUploadValidation.ts';
import { useDropZone } from '@vueuse/core';
import { ref, watch } from 'vue';
import { Cropper, type CropperResult } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const model = defineModel<boolean>();

defineProps<{
  loading: boolean;
}>();

const emit = defineEmits<{
  submit: [value: CropperResult];
}>();

const { allowedTypesAvatar, fileSizeCheck, maxFileSize } = useUploadValidation();

const dropZoneRef = ref<HTMLDivElement | null>(null);
const image = ref<File | string>('');
const isValidated = ref(false);
const cropper = ref<InstanceType<typeof Cropper> | null>(null);

const onDrop = (files: File[] | null) => {
  isValidated.value = false;

  if (files) {
    if (!fileSizeCheck(files)) {
      model.value = false;
      return;
    }

    const file = files[0];
    if (files.length && file) {
      image.value = URL.createObjectURL(file);
    }
  }
};

const { isOverDropZone } = useDropZone(dropZoneRef, {
  dataTypes: allowedTypesAvatar.values,
  onDrop: onDrop,
});

const addFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files: FileList | null = target.files;
  if (files && files.length) {
    if (!fileSizeCheck(files)) {
      model.value = false;
      return;
    }

    const file = files[0];
    if (file) {
      image.value = URL.createObjectURL(file);
    }
  }
};

const submitFile = async () => {
  emit('submit', cropper.value?.getResult() as CropperResult);
};

watch(
  () => model.value,
  (value) => {
    if (!value) {
      image.value = '';
    }
  },
);
</script>

<template>
  <BaseDialog v-model:open="model" class="max-w-380">
    <template #header>
      <h2 class="text-21 font-secondary">
        {{ $t('changeProfilePicture') }}
      </h2>
    </template>
    <template #content>
      <label
        v-show="!image"
        ref="dropZoneRef"
        class="rounded-8 bg-bone block h-188 cursor-pointer"
        :class="{
          'border-error-500 border': !isOverDropZone && isValidated,
          'border-success-500 border': isOverDropZone && isValidated,
        }"
        @dragenter.stop="isValidated = true"
        @dragleave.stop="isValidated = false"
      >
        <span class="pointer-events-none flex h-full flex-col items-center justify-center gap-12">
          <IconClip class="text-coal" />

          <span class="text-14 flex flex-col items-center justify-center gap-4 text-center">
            <span class="text-secondary-text">{{ $t('dragYourFilesHereOr') }}</span>

            <input
              ref="fileInput"
              type="file"
              multiple
              class="hidden"
              :accept="allowedTypesAvatar.values.join(',')"
              @change="addFile"
            />

            <span class="lowercase">
              {{ $t('clickToUpload') }}
            </span>
          </span>
        </span>
      </label>

      <div v-if="!image" class="text-12 text-secondary-text mt-16 flex flex-col">
        <p>{{ $t('supportedFormats') }}: {{ allowedTypesAvatar.types.join(', ') }}</p>
        <p>{{ $t('maxFileSize') }}: {{ maxFileSize }}MB</p>
      </div>
      <Cropper v-else ref="cropper" class="w-full" :src="image" :stencil-component="StencilCrop" />
    </template>
    <template #footer>
      <div class="flex items-center gap-12">
        <BaseButton theme="outline" class="w-full" :disabled="loading" @click="model = false">
          {{ $t('cancel') }}
        </BaseButton>

        <BaseButton class="w-full" :disabled="!image" :loading @click="submitFile">
          {{ $t('upload') }}
        </BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>
