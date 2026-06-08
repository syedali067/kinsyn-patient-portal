<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';

const isOpen = defineModel<boolean>({ default: false });
</script>

<template>
  <BaseDialog v-model:open="isOpen" position="right" class="lg:w-424">
    <template #header>
      <span class="text-21 font-secondary">
        {{ $t('kinsynAiCompanion') }}
      </span>
    </template>
    <template #content>
      <div class="text-secondary-text text-14 lg:text-16 flex flex-col gap-32 font-normal">
        <p>{{ $t('yourAITransformsYourPlan') }}</p>
        <p>{{ $t('builtToComplementYourClinicalCareItHelpsYou') }}</p>
        <p>
          {{ $t('theseInsightsAreNotMedicalAdvice') }}.
          {{ $t('alwaysConsultYourHealthcareProviderWithAnyQuestions') }}
        </p>
      </div>
    </template>
  </BaseDialog>
</template>
