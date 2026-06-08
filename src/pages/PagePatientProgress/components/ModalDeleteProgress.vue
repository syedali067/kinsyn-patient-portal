<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import { ProgressType } from '@/enums/progress';
import type { ProgressCard } from '@/types/progress';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { format } from 'date-fns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const model = defineModel<boolean>();

const props = defineProps<{
  progress?: ProgressCard;
  loading?: boolean;
}>();

const emit = defineEmits<{
  delete: [value: number];
}>();

const { t } = useI18n();
const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const title = computed(() =>
  props.progress?.type === ProgressType.Attachments
    ? t('picture').toLocaleLowerCase()
    : t('weight').toLocaleLowerCase(),
);

const onDelete = () => {
  if (props.progress) {
    emit('delete', props.progress.id);
  }
};
</script>

<template>
  <BaseDialog
    v-model:open="model"
    class="max-w-380"
    :position="greaterOrEqualLg ? 'center' : 'bottom'"
    data-testpl="modal-delete-progress"
  >
    <template #header>
      <h2 class="text-21 font-secondary" data-testpl="modal-delete-progress-title">
        {{
          $t('areYouSureYouWantToDeleteThisValue', {
            value: title,
          })
        }}
      </h2>
    </template>

    <template #content>
      <div
        v-if="progress?.type === ProgressType.Attachments"
        class="flex flex-col items-center gap-8"
        data-testpl="modal-delete-progress-attachment"
      >
        <img
          class="rounded-4 h-141 w-full max-w-106 object-cover"
          :src="progress.attachments[0]?.url"
          :alt="progress.attachments[0]?.filename"
          data-testpl="modal-delete-progress-attachment-img"
        />

        <span
          class="text-14 text-secondary-text"
          data-testpl="modal-delete-progress-attachment-date"
        >
          {{ format(progress.dateCreated, 'MMMM d, EEE') }}
        </span>
      </div>

      <div
        v-if="progress?.type === ProgressType.Weight"
        class="flex flex-col items-center gap-8"
        data-testpl="modal-delete-progress-weight"
      >
        <figure
          class="group rounded-4 relative flex h-141 w-full max-w-106 flex-col items-center justify-center gap-8"
          :class="{
            'bg-bone': !progress.startedWeight,
            'bg-beige/50': progress.startedWeight,
          }"
          data-testpl="modal-delete-progress-weight-figure"
        >
          <span
            v-if="progress.meta?.milestoneWeight"
            class="text-21 text-secondary"
            data-testpl="modal-delete-progress-weight-milestone"
          >
            {{
              $t('weightLbs', {
                value: progress.meta.milestoneWeight,
              })
            }}
          </span>

          <span class="text-12" data-testpl="modal-delete-progress-weight-down-or-up">
            <template v-if="progress.meta?.downWeight">
              {{
                $t('weightDown', {
                  value: progress.meta.downWeight,
                })
              }}
            </template>

            <template v-if="progress.meta?.upWeight">
              {{
                $t('weightUp', {
                  value: progress.meta.upWeight,
                })
              }}
            </template>
          </span>

          <span v-if="progress.startedWeight" data-testpl="modal-delete-progress-weight-starting">
            {{ $t('startingWeight') }}
          </span>
        </figure>

        <span class="text-14 text-secondary-text" data-testpl="modal-delete-progress-weight-date">
          {{ format(progress.dateCreated, 'MMMM d, EEE') }}
        </span>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center gap-12">
        <BaseButton
          theme="outline"
          class="w-full"
          data-testpl="modal-delete-progress-cancel-btn"
          @click="model = false"
        >
          {{ $t('cancel') }}
        </BaseButton>

        <BaseButton
          class="w-full"
          :loading
          data-testpl="modal-delete-progress-delete-btn"
          @click="onDelete"
        >
          {{ $t('delete') }}
        </BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>
