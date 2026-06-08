<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import MainLogo from '@/components/MainLogo/MainLogo.vue';

const open = defineModel<boolean>('open', { default: false });
</script>

<template>
  <BaseDialog
    v-model:open="open"
    class="max-w-424"
    position="right"
    data-testpl="password-changed-drawer"
  >
    <template #header> <MainLogo /> </template>

    <template #content>
      <div class="flex flex-col gap-32">
        <p class="flex flex-col gap-16">
          <span class="text-18">
            {{ $t('passwordChanged') }}
          </span>

          <span class="text-14 text-secondary-text">
            {{ $t('yourPasswordHasChangedYouCanNowLoginWithYourNewPassword') }}
          </span>
        </p>

        <BaseButton class="w-full" @click="open = false" data-testpl="password-changed-drawer-btn">
          {{ $t('loginToYourAccount') }}
        </BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>
