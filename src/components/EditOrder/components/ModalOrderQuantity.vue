<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';

const isOpen = defineModel<boolean>({ default: false });

const emits = defineEmits<{
  close: [];
}>();
</script>

<template>
  <BaseDialog v-model:open="isOpen" @close="emits('close')" position="right" class="max-w-424">
    <template #header> Change order quantity </template>

    <template #content>
      <div class="flex flex-col gap-32">
        <div class="flex items-center gap-16">
          <picture class="rounded-4 bg-sand/20 h-110 w-81 shrink-0 overflow-hidden">
            <img
              src="@/assets/images/to-delete-zepbound.png"
              alt=""
              class="h-full w-full object-cover"
            />
          </picture>

          <div class="flex grow flex-col gap-8">
            <span class="text-10 text-beige font-medium uppercase">WEIGHT LOSS</span>

            <div class="flex gap-16">
              <span class="grow truncate">Zepbound™</span>

              <span>$50</span>
            </div>

            <span class="text-14 text-secondary-text uppercase">300 GR</span>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <BaseButton class="w-full">{{ $t('confirm') }} –– 3 MONTH SUPPLY</BaseButton>
    </template>
  </BaseDialog>
</template>
