<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import BaseTooltip from '@/components/BaseTooltip/BaseTooltip.vue';
import type { Interpretation, LabResult } from '@/types/integration.ts';
import { useI18n } from 'vue-i18n';

const isOpen = defineModel<boolean>({ default: false });

defineProps<{
  labResult: LabResult;
}>();

const { t } = useI18n();

const interpretationMapping = (item: Interpretation) => {
  switch (item) {
    case 'N':
      return t('normal');
    case 'L':
      return t('low');
    case 'A':
      return t('abnormal');
    case 'LX':
      return t('lowCritical');
    case 'H':
      return t('high');
    case 'HX':
      return t('highCritical');
    default:
      return t('noData');
  }
};
</script>

<template>
  <BaseDialog v-model:open="isOpen" position="right" class="max-w-424">
    <template #header>
      <div class="flex flex-col gap-8">
        <span class="text-21 font-secondary font-medium">{{ labResult.title }}</span>
        <span class="text-14 text-disabled-text">{{ labResult.location }}</span>
      </div>
    </template>

    <template #content>
      <div class="flex flex-col gap-24">
        <div v-for="item in labResult.results" :key="item.id" class="flex flex-col gap-24">
          <span class="text-18">{{ item.name }}</span>
          <ul class="flex flex-col gap-16">
            <li class="grid grid-cols-4">
              <span class="text-14 text-secondary-text col-span-3">{{ $t('value') }}:</span>
              <span class="text-14 col-span-1 font-medium">{{ item.value ?? '-' }}</span>
            </li>
            <li class="grid grid-cols-4">
              <span class="text-14 text-secondary-text col-span-3">{{ $t('valueUnit') }}:</span>
              <span class="text-14 col-span-1 font-medium">{{ item.valueUnit ?? '-' }}</span>
            </li>
            <li class="grid grid-cols-4">
              <span class="text-14 text-secondary-text col-span-3">
                {{ $t('referenceRange') }}:
              </span>
              <span class="text-14 col-span-1 font-medium">{{ item.referenceRange ?? '-' }}</span>
            </li>
            <li class="grid grid-cols-4">
              <span class="text-14 text-secondary-text col-span-3">
                {{ $t('interpretation') }}:
              </span>
              <div class="col-span-1">
                <BaseTooltip
                  v-if="item.interpretation"
                  align="center"
                  side="top"
                  content-class="border border-bone"
                >
                  <template #trigger>
                    <span
                      class="text-14 col-span-1 font-medium"
                      :class="{ 'text-error': item.interpretation === 'LX' }"
                    >
                      {{ item.interpretation }}
                    </span>
                  </template>
                  <template #default>
                    <span class="text-12 font-medium">
                      {{ interpretationMapping(item.interpretation) }}
                    </span>
                  </template>
                </BaseTooltip>
                <span v-else class="text-14 font-medium">-</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
