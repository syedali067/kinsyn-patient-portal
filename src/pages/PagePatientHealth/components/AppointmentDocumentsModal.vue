<script setup lang="ts">
import IconDownload from '@/assets/icons/download.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import { downloadFile } from '@/utils/download';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

defineProps<{
  documents?: {
    date: string;
    fileName: string;
    fileUri: string;
  }[];
  title: string;
}>();

const model = defineModel<boolean>({ default: false });

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');
</script>

<template>
  <BaseDialog
    v-model:open="model"
    :position="greaterOrEqualLg ? 'center' : 'right'"
    class="max-w-424"
  >
    <template #header>
      <h2 data-testpl="appointment-documents-modal-title">{{ title }} ({{ documents?.length }})</h2>
    </template>
    <template #content>
      <ul
        class="border-bone flex w-full flex-col gap-16 border-t pt-16"
        data-testpl="appointment-documents-modal-list"
      >
        <li
          v-for="(document, index) in documents"
          :key="index"
          class="flex flex-col gap-4"
          data-testpl="appointment-documents-modal-item"
        >
          <div class="flex w-full items-center justify-between gap-8">
            <p class="text-14 w-full break-all" data-testpl="appointment-documents-modal-title">
              {{ document.fileName }}
            </p>

            <BaseButton
              class="shrink-0"
              theme="link"
              data-testpl="appointment-documents-modal-download-btn"
              @click="downloadFile(document.fileUri)"
            >
              <IconDownload class="size-20" />
            </BaseButton>
          </div>
          <p v-if="document.date" class="text-14 text-stone">
            {{ document.date }}
          </p>
        </li>
      </ul>
    </template>
  </BaseDialog>
</template>
