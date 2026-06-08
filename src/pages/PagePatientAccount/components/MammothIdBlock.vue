<script setup lang="ts">
import IconCopy from '@/assets/icons/copy.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { useMammothConditions } from '@/composables/useMammothConditions';
import { useToastStore } from '@/stores/toast';
import { useI18n } from 'vue-i18n';

const { mammothData } = useMammothConditions();

const toastStore = useToastStore();
const { t } = useI18n();

const copyToClipboard = () => {
  if (mammothData.value?.patientId) {
    navigator.clipboard.writeText(mammothData.value?.patientId);

    toastStore.addToast({
      type: 'success',
      text: t('copiedToClipboard'),
    });
  }
};
</script>

<template>
  <section v-if="mammothData?.patientId" class="rounded-8 flex flex-col gap-24 bg-white p-24">
    <p>{{ $t('healthDataId') }}</p>

    <div class="flex items-center justify-between gap-8">
      <p class="text-14">{{ mammothData?.patientId }}</p>
      <BaseButton theme="outline" size="37" class="shrink-0" @click="copyToClipboard">
        <template #prepend>
          <IconCopy class="size-20" />
        </template>
      </BaseButton>
    </div>
  </section>
</template>
