<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import { maskWeight } from '@/composables/useMaskOptions';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { vMaska } from 'maska/vue';
import { reactive } from 'vue';

const model = defineModel<boolean>();

defineProps<{
  loading?: boolean;
}>();

const emit = defineEmits<{
  upload: [value: string];
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const formData = reactive<{
  weight: string;
}>({
  weight: '',
});

const clear = () => {
  formData.weight = '';
};

defineExpose({
  clear,
});
</script>

<template>
  <BaseDialog
    v-model:open="model"
    class="max-w-380"
    :position="greaterOrEqualLg ? 'center' : 'bottom'"
    data-testpl="modal-add-weight-progress"
  >
    <template #header>
      <h2 class="text-21 font-secondary" data-testpl="modal-add-weight-progress-title">
        {{ $t('weightCheckIn') }}
      </h2>
    </template>

    <template #content>
      <p class="text-14" data-testpl="modal-add-weight-progress-text">
        {{ $t('monitorYourProgressRegularlyAndMakeSureToUpdateYourCurrentWeight') }}
      </p>

      <BaseInput
        v-model="formData.weight"
        v-maska="maskWeight"
        :placeholder="$t('yourCurrentWeight')"
        inputmode="decimal"
        class="mt-24"
        data-testpl="modal-add-weight-progress-input"
      >
        <template #append>
          <span class="text-14 text-secondary-text"> {{ $t('lbs') }} </span>
        </template>
      </BaseInput>
    </template>

    <template #footer>
      <div class="flex items-center gap-12">
        <BaseButton
          theme="outline"
          class="w-full"
          data-testpl="modal-add-weight-progress-cancel-btn"
          @click="model = false"
        >
          {{ $t('cancel') }}
        </BaseButton>

        <BaseButton
          class="w-full"
          :disabled="!formData.weight"
          :loading
          data-testpl="modal-add-weight-progress-upload-btn"
          @click="emit('upload', formData.weight)"
        >
          {{ $t('upload') }}
        </BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>
