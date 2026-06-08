<script setup lang="ts">
import BaseButton from '../BaseButton/BaseButton.vue';
import BaseDialog from '../BaseDialog/BaseDialog.vue';
import BaseSpinner from '../BaseSpinner/BaseSpinner.vue';
import type { PreviewItem } from './types';
import { apiFiles } from '@/api/files';
import IconDownload from '@/assets/icons/download.svg?component';
import { useStaticData } from '@/composables/useStaticData';
import { downloadFile } from '@/utils/download';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { computed, ref, watch } from 'vue';

const model = defineModel<boolean>({ default: false });
const props = defineProps<{ item?: PreviewItem }>();

const { fileTypes } = useStaticData();
const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualSm = breakpoints.greaterOrEqual('sm');

const isLoading = ref(false);

const currentType = computed(() => {
  const itemType = props.item?.type;
  return fileTypes.value.find((type) => itemType && type.types.includes(itemType))?.id || 'unknown';
});

const loadFile = async (url: string) => {
  try {
    isLoading.value = true;
    const res = await apiFiles.getImage(url);

    if (res.statusCode.value !== 200) {
      return;
    }

    if (currentType.value === 'img') {
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = () => reject();
        img.src = url;
      });
    }
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => props.item?.url,
  (url) => url && loadFile(url),
  { immediate: true },
);
</script>

<template>
  <BaseDialog
    v-model:open="model"
    data-testpl="modal-preview"
    class="h-full lg:h-auto"
    :class="{
      'lg:h-[calc(100%-48px)] lg:w-[calc(100%-48px)]': ['pdf', 'doc'].includes(currentType),
      'lg:max-w-800': !['pdf', 'doc'].includes(currentType),
    }"
  >
    <template v-if="item" #header>
      <div class="flex w-full items-center justify-between gap-16">
        <span class="text-18 break-all">
          {{ item.title }}
        </span>

        <BaseButton
          v-if="greaterOrEqualSm && !isLoading"
          theme="outline"
          size="40"
          @click="downloadFile(item.url)"
        >
          <template #prepend>
            <IconDownload class="size-20" />
          </template>
        </BaseButton>
      </div>
    </template>

    <template v-if="item" #content>
      <div class="flex h-full flex-col gap-16">
        <BaseSpinner v-if="isLoading" class="mx-auto size-20" />

        <template v-else>
          <div v-if="currentType === 'img'" class="flex flex-1 justify-center overflow-auto">
            <img class="object-contain" :src="item.url" />
          </div>

          <iframe
            v-if="currentType === 'doc'"
            class="h-full w-full object-contain"
            :src="`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(item.url)}`"
            data-testpl="modal-preview-doc"
          />

          <iframe
            v-if="currentType === 'pdf'"
            class="h-full min-h-500 w-full"
            :src="item.url"
            type="application/pdf"
            data-testpl="modal-preview-pdf"
          />

          <BaseButton v-if="!greaterOrEqualSm" class="mt-auto" @click="downloadFile(item.url)">
            {{ $t('downloadFile') }}
          </BaseButton>
        </template>
      </div>
    </template>
  </BaseDialog>
</template>
