<script setup lang="ts">
import BaseCheckbox from '../BaseCheckbox/BaseCheckbox.vue';
import type { FileWithMetadataNew } from './types';
import IconClip from '@/assets/icons/clip.svg?component';
import IconTrash from '@/assets/icons/trash.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import { useUploadValidation } from '@/composables/useUploadValidation.ts';
import { UploadVisible } from '@/enums/uploads.ts';
import { useToastStore } from '@/stores/toast';
import type { FileWithMetadata, FileWithMetadataWithoutFile } from '@/types/uploads';
import { useDropZone } from '@vueuse/core';
import { cloneDeep, uniqueId, isEqual } from 'lodash-es';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const model = defineModel<boolean>();

const props = withDefaults(
  defineProps<{
    title?: string;
    checkbox?: boolean;
    loading?: boolean;
    allowedTypes: {
      values: string[];
      types: string[];
    };
    checkFileListChanged?: boolean;
    singleMode?: boolean;
  }>(),
  {
    checkFileListChanged: false,
    singleMode: false,
  },
);

const emit = defineEmits<{
  update: [value: FileWithMetadata[]];
  submit: [value: FileWithMetadata[]];
}>();

const { formatTypesWithAnd, fileSizeCheck, maxFileSize } = useUploadValidation();
const toastStore = useToastStore();
const { t } = useI18n();

const dropZoneRef = ref<HTMLDivElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const { isOverDropZone } = useDropZone(dropZoneRef, {
  dataTypes: props.allowedTypes.values,
  onDrop: onDrop,
});

const filesData = ref<FileWithMetadataNew[]>([]);
const submittedFiles = ref<FileWithMetadata[]>([]);

const isValidated = ref(false);
const availableForPatient = ref(false);

const isSubmitButtonDisabled = computed(() => {
  return isEqual(filesData.value, submittedFiles.value);
});

function onDrop(files: File[] | null) {
  isValidated.value = false;

  if (files) {
    if (!fileSizeCheck(files)) {
      return;
    }

    if (props.singleMode && files.length > 1) {
      toastStore.addToast({
        type: 'neutral',
        text: t('onlyOneFileCanBeUploaded'),
      });
    }

    const filesToAdd = props.singleMode && files[0] ? [files[0]] : files;

    const newData = filesToAdd.map((file) => ({
      file,
      attachmentTitle: file.name,
      id: uniqueId(`file_${Date.now()}`),
      isNew: true,
      isVisible: availableForPatient.value
        ? UploadVisible.VisibleToPatient
        : UploadVisible.InvisibleToPatient,
    }));

    filesData.value.push(...newData);
  }
}

const handleAddMoreClick = () => {
  if (fileInput.value) {
    fileInput.value.value = '';
    fileInput.value.click();
  }
};

const deleteFile = (id: string) => {
  filesData.value = filesData.value.filter((item) => id !== item.id);
  /*
    If you add a file via addFile, then delete the file and then try to add the same file,
    event @change="addFile" doesn't even work. This is standard browser behavior -
    input file does not fire the change event if the same file is selected.
    This code is intended to solve this problem.
  */
  if (fileInput.value) {
    fileInput.value.value = '';
  }

  emit('update', filesData.value);
};

const addFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files: FileList | null = target.files;

  if (files) {
    if (!fileSizeCheck(files)) {
      return;
    }

    const filesToAdd = props.singleMode && files[0] ? [files[0]] : Array.from(files);

    const newData = filesToAdd.map((file) => ({
      file,
      attachmentTitle: file.name,
      id: uniqueId(`file_${Date.now()}`),
      isNew: true,
      isVisible: availableForPatient.value
        ? UploadVisible.VisibleToPatient
        : UploadVisible.InvisibleToPatient,
    }));

    filesData.value.push(...newData);

    emit('update', filesData.value);
  }
};

const submitFiles = async () => {
  submittedFiles.value = cloneDeep(filesData.value);
  emit('submit', filesData.value);
};

const clear = () => {
  filesData.value = [];
  submittedFiles.value = [];
  emit('update', []);
};

const setFiles = (value: FileWithMetadataWithoutFile[]) => {
  filesData.value = value.map((f) => ({
    ...f,
    file: new File([], f.attachmentTitle), // empty file for typesaving
  }));
};

defineExpose({
  clear,
  addFile,
  onDrop,
  setFiles,
});

// Checking is submit button disabled (only then file list are changed)
watch(model, (value) => {
  if (props.checkFileListChanged) {
    filesData.value = value ? cloneDeep(submittedFiles.value) : [];
  }
});

watch(availableForPatient, (value) => {
  if (value)
    filesData.value.forEach((upload) => (upload.isVisible = UploadVisible.VisibleToPatient));
  if (!value)
    filesData.value.forEach((upload) => (upload.isVisible = UploadVisible.InvisibleToPatient));
});
</script>

<template>
  <BaseDialog v-model:open="model" class="max-w-380" data-testpl="modal-upload-files">
    <template #header>
      <h2 data-testpl="modal-upload-files-title">
        {{ title ?? $t('uploadFiles') }}
        <span v-if="filesData.length" data-testpl="modal-upload-files-title-count">
          ({{ filesData.length }})
        </span>
      </h2>
    </template>

    <template #content>
      <label
        v-show="!filesData.length"
        ref="dropZoneRef"
        class="rounded-8 bg-bone block cursor-pointer"
        :class="{
          'h-140': filesData.length,
          'h-188': !filesData.length,
          'outline-error/50 outline-1': !isOverDropZone && isValidated,
          'outline-success/50 outline-1': isOverDropZone && isValidated,
        }"
        data-testpl="modal-upload-files-label"
        @dragenter.stop="isValidated = true"
        @dragleave.stop="isValidated = false"
      >
        <span
          class="pointer-events-none flex h-full flex-col items-center justify-center gap-12"
          data-testpl="modal-upload-files-label-block"
        >
          <IconClip class="text-coal" data-testpl="modal-upload-files-label-block-icon" />

          <span
            class="text-14 flex flex-col items-center justify-center gap-4 text-center"
            data-testpl="modal-upload-files-label-info"
          >
            <span class="text-secondary-text" data-testpl="modal-upload-files-label-text">
              {{ $t('dragYourFilesHereOr') }}
            </span>

            <input
              ref="fileInput"
              type="file"
              :multiple="!singleMode"
              class="hidden"
              :accept="allowedTypes.values.join(',')"
              data-testpl="modal-upload-files-label-input"
              @change="addFile"
            />

            <span class="lowercase underline underline-offset-[0.3em]">
              {{ $t('clickToUpload') }}
            </span>
          </span>
        </span>
      </label>

      <p
        v-if="!filesData.length"
        class="text-secondary-text text-12 mt-16 flex flex-col"
        data-testpl="modal-upload-files-valid-info"
      >
        <span data-testpl="modal-upload-files-valid-info-formats">
          {{ $t('supportedFormats') }}: {{ formatTypesWithAnd(allowedTypes.types) }}
        </span>
        <span data-testpl="modal-upload-files-valid-info-size">
          {{
            $t('maxFileSizeMB', {
              size: maxFileSize,
            })
          }}
        </span>
      </p>

      <BaseCheckbox v-if="checkbox" v-model="availableForPatient" class="mt-24">
        {{ $t('availableForPatient') }}
      </BaseCheckbox>

      <div v-if="filesData.length" class="border-bone flex h-full flex-col gap-24 border-t pt-16">
        <ul
          v-for="file in filesData"
          :key="file.id"
          class="flex flex-col gap-16"
          data-testpl="modal-upload-files-list"
        >
          <li
            class="flex items-center justify-between gap-8"
            data-testpl="modal-upload-files-list-item"
          >
            <p class="text-14 break-all" data-testpl="modal-upload-files-list-item-title">
              {{ file.attachmentTitle }}
            </p>

            <button
              class="shrink-0"
              type="button"
              data-testpl="modal-upload-files-list-item-delete-btn"
              @click="deleteFile(file.id)"
            >
              <IconTrash class="size-20" />
            </button>
          </li>
        </ul>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center gap-12">
        <BaseButton
          v-if="filesData.length && !singleMode"
          theme="outline"
          class="w-full"
          data-testpl="modal-upload-files-add-more-btn"
          @click="handleAddMoreClick"
        >
          {{ $t('addMore') }}
        </BaseButton>

        <BaseButton
          v-else
          theme="outline"
          class="w-full"
          data-testpl="modal-upload-files-cancel-btn"
          @click="model = false"
        >
          {{ $t('cancel') }}
        </BaseButton>

        <BaseButton
          class="w-full"
          :disabled="checkFileListChanged ? isSubmitButtonDisabled : !filesData.length"
          :loading="loading"
          data-testpl="modal-upload-files-upload-btn"
          @click="submitFiles"
        >
          {{ $t('upload') }}
        </BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>
