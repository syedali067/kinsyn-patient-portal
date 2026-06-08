<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import { maskWeight } from '@/composables/useMaskOptions';
import type { ProgressCard } from '@/types/progress';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { vMaska } from 'maska/vue';
import { reactive, watch } from 'vue';

const model = defineModel<boolean>();

const props = defineProps<{
  progress?: ProgressCard;
  loading?: boolean;
}>();

const emit = defineEmits<{
  edit: [value?: number];
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const formData = reactive<{
  weight?: string;
}>({
  weight: '',
});

const onEdit = () => {
  if (props.progress && formData.weight) emit('edit', +formData.weight);
};

const clear = () => {
  formData.weight = '';
};

watch(
  () => props.progress,
  (value) => {
    if (value) formData.weight = props.progress?.meta?.milestoneWeight.toString();
  },
);

defineExpose({
  clear,
});
</script>

<template>
  <BaseDialog
    v-model:open="model"
    class="max-w-380"
    :position="greaterOrEqualLg ? 'center' : 'bottom'"
    data-testpl="modal-edit-weight-progress"
  >
    <template #header>
      <h2 class="text-21 font-secondary" data-testpl="modal-edit-weight-progress-title">
        {{ $t('editWeightCheckIn') }}
      </h2>
    </template>

    <template #content>
      <p class="text-14" data-testpl="modal-edit-weight-progress-text">
        {{ $t('monitorYourProgressRegularlyAndMakeSureToUpdateYourCurrentWeight') }}
      </p>

      <BaseInput
        v-model="formData.weight"
        v-maska="maskWeight"
        :placeholder="$t('weight')"
        inputmode="decimal"
        class="mt-24"
        data-testpl="modal-edit-weight-progress-input"
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
          data-testpl="modal-edit-weight-progress-cancel-btn"
          @click="model = false"
        >
          {{ $t('cancel') }}
        </BaseButton>

        <BaseButton
          class="w-full"
          :disabled="!formData.weight"
          :loading
          data-testpl="modal-edit-weight-progress-edit-btn"
          @click="onEdit"
        >
          {{ $t('edit') }}
        </BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>
