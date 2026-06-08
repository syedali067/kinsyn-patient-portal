<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import type { BaseTab } from '@/components/BaseTabs/types.ts';

const model = defineModel<boolean>();

defineProps<{
  tabs?: BaseTab[];
}>();

const emit = defineEmits<{
  clickTab: [id: string];
}>();
</script>

<template>
  <BaseDialog v-model:open="model" position="bottom" :close-btn="false">
    <template #header>
      <div class="flex w-full flex-col gap-8">
        <button
          type="button"
          v-for="tab in tabs"
          :key="tab.id"
          class="text-18 hover:bg-bone/50 rounded-4 w-full p-8 text-start"
          @click="emit('clickTab', tab.id as string)"
        >
          {{ tab.label }}
        </button>
      </div>
    </template>
  </BaseDialog>
</template>
