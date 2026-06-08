<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';

const open = defineModel<boolean>('open', { default: false });
</script>

<template>
  <BaseDialog
    v-model:open="open"
    class="max-w-424"
    position="right"
    data-testpl="check-email-drawer"
  >
    <template #header> {{ $t('forgotPassword') }} </template>

    <template #content>
      <div class="flex flex-col gap-32">
        <p class="flex flex-col gap-16">
          <span class="text-18">
            {{ $t('checkYourEmail') }}
          </span>

          <span class="text-14 text-secondary-text">
            {{ $t('youShouldReceiveAnEmail') }}
          </span>
        </p>

        <p class="text-14 flex gap-4">
          <span>{{ $t('didntReceiveIt') }}</span>

          <RouterLink
            :to="{
              params: {
                type: 'forgot-password',
              },
            }"
            class="text-link-text font-medium"
            data-testpl="check-email-drawer-resend-btn"
          >
            {{ $t('resendLink') }}
          </RouterLink>
        </p>

        <BaseButton @click="open = false" data-testpl="check-email-drawer-back-btn">
          {{ $t('backToLogin') }}
        </BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>
