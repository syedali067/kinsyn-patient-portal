<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseCalendar from '@/components/BaseCalendar/BaseCalendar.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';

const isOpen = defineModel<boolean>({ default: false });

const emits = defineEmits<{
  close: [];
}>();
</script>

<template>
  <BaseDialog v-model:open="isOpen" @close="emits('close')" position="right" class="max-w-424">
    <template #header>Change next shipment</template>

    <template #content>
      <p class="text-14 text-secondary-text mb-32">Change the date of your shipment</p>

      <BaseCalendar />
    </template>

    <template #footer>
      <BaseButton class="w-full">
        {{ $t('confirm') }}
      </BaseButton>
    </template>
  </BaseDialog>
</template>
