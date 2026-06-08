<script setup lang="ts">
import IconDownload from '@/assets/icons/download.svg?component';
import type { PreviewItem } from '@/components/ModalPreview/types';
import { useStaticData } from '@/composables/useStaticData';
import type { ChatMessageAttachment } from '@/types/chat';
import { formatFileSize } from '@/utils/formatters.ts';
import { computed } from 'vue';

const props = defineProps<{
  attachment: ChatMessageAttachment;
}>();

const emit = defineEmits<{
  preview: [value: PreviewItem];
}>();

const { fileTypes } = useStaticData();

const filename = computed(() => {
  return props.attachment.filename || props.attachment.title || '';
});

const currentTypeIcon = computed(() => {
  const foundType = fileTypes.value.find((type) =>
    type.types.includes(props.attachment.kind || props.attachment.mimeType),
  )?.icon;

  return foundType ? foundType : fileTypes.value.find((type) => type.id === 'unknown')?.icon;
});

const isNoPreview = computed(() => {
  const noPreviewExtensions = ['dng', 'doc', 'docx', 'tiff'];
  const extension = filename.value.split('.').pop()?.toLowerCase() || '';

  return noPreviewExtensions.includes(extension);
});

const handlePreview = () => {
  if (isNoPreview.value) return;

  emit('preview', {
    title: props.attachment.title || props.attachment.filename,
    type: props.attachment.kind || props.attachment.mimeType,
    url: props.attachment.url,
  });
};

const attributes = computed(() => {
  if (isNoPreview.value) {
    return {
      href: props.attachment.url,
      download: filename.value,
      'data-testpl': 'message-attachment-download-link',
    };
  }

  return {
    type: 'button',
  };
});
</script>

<template>
  <li class="rounded-4 flex gap-8 py-8 pl-8 hover:bg-white/50" data-testpl="message-attachment">
    <component
      :is="isNoPreview ? 'a' : 'button'"
      v-bind="attributes"
      class="flex w-full cursor-pointer items-center gap-8 text-start"
      @click="handlePreview()"
    >
      <component
        :is="currentTypeIcon"
        class="size-40 shrink-0"
        data-testpl="message-attachment-icon"
      />

      <span class="flex flex-col justify-center gap-4" data-testpl="message-attachment-info">
        <span
          class="text-14 block max-w-180 truncate break-all sm:max-w-236 md:max-w-348"
          data-testpl="message-attachment-info-name"
        >
          {{ filename }}
        </span>

        <span class="text-10 text-secondary-text block" data-testpl="message-attachment-info-size">
          {{ formatFileSize(attachment.size) }}
        </span>
      </span>
    </component>

    <a
      :href="attachment.url"
      :download="filename"
      class="text-coal hover:text-beige inline-flex size-40 shrink-0 items-center justify-center"
      data-testpl="message-attachment-link"
    >
      <IconDownload />
    </a>
  </li>
</template>
