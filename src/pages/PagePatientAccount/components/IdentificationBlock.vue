<script setup lang="ts">
import { useIdentification } from '../composables/useIdentification';
import UploadDocument from './UploadDocument.vue';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { useUploadValidation } from '@/composables/useUploadValidation';
import { useUserStore } from '@/stores/user';
import type { ImageSrc, FileType } from '@/types/document';
import { ref, reactive } from 'vue';

withDefaults(
  defineProps<{
    type?: 'account' | 'completeDetails';
  }>(),
  {
    type: 'account',
  },
);

const { uploadDocument, deleteDocument } = useIdentification();
const { allowedTypesIdentification, fileSizeCheck } = useUploadValidation();
const userStore = useUserStore();

const documentLoading = ref(false);
const idPictureLoading = ref(false);

const imageSrc: ImageSrc = reactive({
  document: userStore.profile?.user?.document ?? null,
  idPicture: userStore.profile?.user?.idPicture ?? null,
});

const loading = (type: FileType, isLoading: boolean) => {
  switch (type) {
    case 'document':
      documentLoading.value = isLoading;
      break;
    case 'idPicture':
      idPictureLoading.value = isLoading;
      break;
  }
};

const handleUpload = async (type: FileType, files: File[]) => {
  loading(type, true);

  try {
    const file = files[0];

    if (file) {
      if (!fileSizeCheck(file)) {
        return;
      }

      imageSrc[type] = await uploadDocument(type, file);
    }
  } finally {
    loading(type, false);
  }
};

const handleDelete = async (type: FileType) => {
  loading(type, true);

  try {
    await deleteDocument(type);
    imageSrc[type] = null;
  } finally {
    loading(type, false);
  }
};

defineExpose({
  documentLoading,
  idPictureLoading,
});
</script>

<template>
  <section
    data-testpl="account-identification"
    class="rounded-8 flex flex-col gap-2 p-24"
    :class="{ 'bg-white': type === 'account' }"
  >
    <div class="flex w-full flex-col gap-24">
      <p v-if="type === 'account'">{{ $t('identification') }}</p>
      <div class="flex flex-col gap-24 lg:flex-row">
        <div
          data-testpl="account-identification-photo"
          class="flex w-full flex-col gap-16 lg:gap-24"
        >
          <div class="flex items-center justify-between gap-8">
            <span class="text-beige text-10 font-medium uppercase">
              {{ $t('selfieCurrentPhoto') }}
            </span>

            <BaseButton
              v-if="imageSrc.document"
              theme="link"
              class="!capitalize"
              :disabled="documentLoading"
              @click="handleDelete('document')"
            >
              {{ $t('remove') }}
            </BaseButton>
          </div>

          <UploadDocument
            data-testpl="upload-document-document"
            :allowed-types="allowedTypesIdentification"
            :file-src="imageSrc.document"
            :loading="documentLoading"
            @upload="(files) => handleUpload('document', files)"
          />
        </div>
        <div
          data-testpl="account-identification-id-card"
          class="flex w-full flex-col gap-16 lg:gap-24"
        >
          <div class="flex items-center justify-between gap-8">
            <span class="text-beige text-10 font-medium uppercase">
              {{ $t('idDrivingLicense') }}
            </span>

            <BaseButton
              v-if="imageSrc.idPicture"
              theme="link"
              class="!capitalize"
              :disabled="idPictureLoading"
              @click="handleDelete('idPicture')"
            >
              {{ $t('remove') }}
            </BaseButton>
          </div>

          <UploadDocument
            data-testpl="upload-document-id-picture"
            :allowed-types="allowedTypesIdentification"
            :file-src="imageSrc.idPicture"
            :loading="idPictureLoading"
            @upload="(files) => handleUpload('idPicture', files)"
          />
        </div>
      </div>
    </div>
  </section>
</template>
