<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';

const model = defineModel<boolean>({ default: false });

defineProps<{
  title: string;
  text?: string;
  confirmButtonLabel: string;
}>();

const emit = defineEmits<{
  confirm: [];
}>();
</script>

<template>
  <BaseDialog v-model:open="model" class="max-w-380">
    <template #header>
      <h1 class="text-21 font-secondary">{{ title }}</h1>
    </template>

    <template #content>
      <p v-if="text" class="text-14 my-16">{{ text }}</p>
    </template>

    <template #footer>
      <div class="flex gap-8">
        <BaseButton theme="outline" class="w-full" @click="model = false">
          {{ $t('cancel') }}
        </BaseButton>
        <BaseButton class="w-full" @click="emit('confirm')">
          {{ confirmButtonLabel }}
        </BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>
