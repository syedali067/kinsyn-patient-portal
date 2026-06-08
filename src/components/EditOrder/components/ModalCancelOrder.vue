<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import BaseTextarea from '@/components/BaseTextarea/BaseTextarea.vue';
import { ref } from 'vue';

const isOpen = defineModel<boolean>({ default: false });

const emit = defineEmits<{
  close: [];
}>();

const cancelText = ref('');
</script>

<template>
  <BaseDialog v-model:open="isOpen" @close="emit('close')" position="right" class="max-w-424">
    <template #header>
      {{ $t('cancelOrder') }}
    </template>

    <template #content>
      <div class="prose text-14 mb-32">
        <p>
          {{ $t('ifYoudLikeToModifyYourTreatment') }}
        </p>

        <p>
          {{ $t('ifYoudPreferToCancelThisTreatmentPleaseUseTheButtonBelow') }}
        </p>
      </div>

      <BaseTextarea v-model="cancelText" :placeholder="$t('typeMessage')" :rows="6" />
    </template>

    <template #footer>
      <BaseButton class="w-full" theme="outline">
        {{ $t('cancelTreatment') }}
      </BaseButton>
    </template>
  </BaseDialog>
</template>
