<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';

const model = defineModel<boolean>();
</script>

<template>
  <BaseDialog v-model:open="model" position="right" class="max-w-424" data-testpl="drawer-info">
    <template #header>
      {{ $t('whyDoWeAskThis') }}
    </template>
    <template #content>
      <p class="text-secondary-text">
        {{ $t('toEnsureYourSafetyAndComplyWithFederalTelemedicineRegulations') }}
      </p>
    </template>
  </BaseDialog>
</template>
