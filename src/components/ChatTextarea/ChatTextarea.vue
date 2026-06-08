<script lang="ts" setup>
import BaseEditor from '../BaseEditor/BaseEditor.vue';
import IconClip from '@/assets/icons/clip.svg?component';
import IconSend from '@/assets/icons/send.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseCounter from '@/components/BaseCounter/BaseCounter.vue';
import ModalUploadFiles from '@/components/ModalUploadFiles/ModalUploadFiles.vue';
import { useUploadValidation } from '@/composables/useUploadValidation.ts';
import type { FileWithMetadata, FileWithMetadataWithoutFile } from '@/types/uploads';
import { ref } from 'vue';

defineProps<{
  chatId: number;
}>();

const emit = defineEmits<{
  sendMessage: [
    value: {
      message: string;
      attachments: File[];
    },
  ];
}>();

const { allowedTypesChat } = useUploadValidation();

const messageText = ref('');
const attachments = ref<FileWithMetadataWithoutFile[]>([]);
const attachmentIdsForDelete = ref<FileWithMetadata['id'][]>([]);
const tempFormData = ref<{
  message: string;
  attachments: FileWithMetadataWithoutFile[];
} | null>(null);

const isModalUploadFilesVisible = ref(false);
const modalUploadFiles = ref<InstanceType<typeof ModalUploadFiles> | null>(null);

const reset = () => {
  messageText.value = '';
  attachments.value = [];
  attachmentIdsForDelete.value = [];
  modalUploadFiles.value?.clear();
};

const restoreForm = () => {
  if (tempFormData.value) {
    messageText.value = tempFormData.value.message;
    attachments.value = [...tempFormData.value.attachments];
    tempFormData.value = null;
  }
};

const clearRestoreForm = () => {
  tempFormData.value = null;
};

const onSendMessage = async () => {
  tempFormData.value = {
    message: messageText.value,
    attachments: [...attachments.value],
  };

  reset();

  emit('sendMessage', {
    message: tempFormData.value.message,
    attachments: tempFormData.value.attachments.map((a) => a.file as File),
  });
};

const onSubmitAttachments = (data: FileWithMetadata[]) => {
  // compare the data and get the ID of the deleted ones
  attachmentIdsForDelete.value = attachments.value
    .filter((a) => !data.find((d) => d.id === a.id))
    .map((a) => a.id);

  attachments.value = data;
  isModalUploadFilesVisible.value = false;
};

defineExpose({
  reset,
  restoreForm,
  clearRestoreForm,
});
</script>

<template>
  <ModalUploadFiles
    ref="modalUploadFiles"
    v-model="isModalUploadFilesVisible"
    :title="$t('attachFiles')"
    :allowed-types="allowedTypesChat"
    check-file-list-changed
    @submit="onSubmitAttachments"
  />

  <div class="flex w-full min-w-0 items-end gap-12" data-testpl="chat-textarea">
    <div class="min-w-0 flex-1" data-testpl="chat-textarea-block">
      <BaseEditor
        v-model="messageText"
        :placeholder="$t('typeMessage')"
        field-class="min-h-64 max-h-110 lg:max-h-160"
        @send-message="onSendMessage"
      >
        <template #append>
          <div class="flex h-full items-end">
            <span class="relative h-28">
              <button
                class="text-coal hover:text-beige"
                type="button"
                data-testpl="chat-textarea-open-modal-upload-file"
                @click="isModalUploadFilesVisible = true"
              >
                <IconClip />
              </button>

              <BaseCounter
                v-model="attachments.length"
                class="absolute -top-[25%] -right-[25%] z-1"
                size="16"
              />
            </span>
          </div>
        </template>
      </BaseEditor>
    </div>

    <BaseButton
      size="64"
      :disabled="attachments.length !== 0 ? false : !messageText"
      data-testpl="chat-textarea-send-btn"
      @click="onSendMessage"
    >
      <template #append>
        <IconSend />
      </template>
    </BaseButton>
  </div>
</template>
