<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import { useValidator } from '@/composables/useValidator';
import { useUserStore } from '@/stores/user';
import useVuelidate from '@vuelidate/core';
import { reactive } from 'vue';

const open = defineModel<boolean>('open', { default: false });

const userStore = useUserStore();
const { emailRules } = useValidator();

const formData = reactive<{
  email: string;
}>({
  email: '',
});

const v$ = useVuelidate(
  {
    email: emailRules,
  },
  formData,
  { $scope: false },
);

const onSubmit = async () => {
  if (!(await v$.value.$validate())) {
    return;
  }

  if (await userStore.resetPassword({ loginName: formData.email })) {
    v$.value.$reset();
    formData.email = '';
  }
};
</script>

<template>
  <BaseDialog
    v-model:open="open"
    class="max-w-424"
    position="right"
    data-testpl="forgot-password-drawer"
  >
    <template #header> {{ $t('forgotPassword') }} </template>

    <template #content>
      <div class="flex flex-col gap-32">
        <p class="text-18">
          {{ $t('enterYourEmail') }}
        </p>

        <form
          class="flex flex-col gap-32"
          data-testpl="forgot-password-drawer-form"
          @submit.prevent="onSubmit"
        >
          <BaseInput
            v-model.trim="formData.email"
            :error="v$.email.$errors[0]?.$message"
            class="w-full"
            :placeholder="$t('email')"
            color="dark"
            type="email"
            name="email"
            autocomplete="email"
            data-testpl="forgot-password-drawer-email-input"
          />

          <BaseButton
            type="submit"
            class="w-full"
            data-testpl="forgot-password-drawer-reset-btn"
            :loading="userStore.resetPasswordLoading"
          >
            {{ $t('resetPassword') }}
          </BaseButton>
        </form>

        <p class="text-14 flex justify-center gap-4">
          <span>{{ $t('rememberYourPassword') }}</span>

          <button
            class="text-link-text font-medium"
            @click="open = false"
            type="button"
            data-testpl="forgot-password-drawer-back-btn"
          >
            {{ $t('backToLogin') }}
          </button>
        </p>
      </div>
    </template>
  </BaseDialog>
</template>
