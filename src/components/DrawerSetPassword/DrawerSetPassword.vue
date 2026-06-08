<script setup lang="ts">
import IconCloseEye from '@/assets/icons/close-eye.svg?component';
import IconEye from '@/assets/icons/eye.svg?component';
import IconHelp from '@/assets/icons/help.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import BaseTooltip from '@/components/BaseTooltip/BaseTooltip.vue';
import MainLogo from '@/components/MainLogo/MainLogo.vue';
import { useValidator } from '@/composables/useValidator';
import { useUserStore } from '@/stores/user';
import useVuelidate from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();

const open = defineModel<boolean>('open', { default: false });

const route = useRoute();
const userStore = useUserStore();
const { passwordRules } = useValidator();

const newPasswordType = ref<'text' | 'password'>('password');
const confirmNewPasswordType = ref<'text' | 'password'>('password');

const formData = reactive<{
  newPassword: string;
  confirmNewPassword: string;
}>({
  newPassword: '',
  confirmNewPassword: '',
});

const v$ = useVuelidate(
  {
    newPassword: passwordRules,
    confirmNewPassword: {
      sameAs: helpers.withMessage(
        t('mustMatchTheNewPassword'),
        (value: string) => value === formData.newPassword,
      ),
    },
  },
  formData,
  { $scope: false },
);

const onSubmit = async () => {
  if (!(await v$.value.$validate())) {
    return;
  }

  if (route.query.code && route.query.id) {
    if (
      await userStore.setPassword({
        code: route.query.code as string,
        id: route.query.id as string,
        newPassword: formData.newPassword,
      })
    ) {
      v$.value.$reset();
      formData.newPassword = '';
      formData.confirmNewPassword = '';
    }
  }
};
</script>

<template>
  <BaseDialog
    v-model:open="open"
    class="max-w-424"
    position="right"
    data-testpl="set-password-drawer"
  >
    <template #header> <MainLogo /> </template>

    <template #content>
      <div class="flex flex-col gap-32">
        <p class="flex flex-col gap-16">
          <span class="text-18">
            {{ $t('resetYourPassword') }}
          </span>

          <span class="text-14 text-secondary-text">
            {{ $t('enterANewPasswordBelowToChangeYourPassword') }}
          </span>
        </p>

        <form
          class="flex flex-col gap-32"
          data-testpl="set-password-drawer-form"
          @submit.prevent="onSubmit"
        >
          <div class="flex flex-col gap-16">
            <BaseInput
              v-model="formData.newPassword"
              :error="v$.newPassword.$errors[0]?.$message"
              class="w-full"
              :placeholder="$t('newPassword')"
              color="dark"
              :type="newPasswordType"
              autocomplete="off"
              data-testpl="set-password-drawer-new-input"
            >
              <template #append>
                <div class="flex gap-12">
                  <BaseTooltip align="center" side="top" content-class="border border-bone">
                    <template #trigger>
                      <IconHelp class="shrink-0" />
                    </template>
                    <template #default>
                      {{ $t('yourPasswordMustContain') }}
                      <br />
                      {{ $t('oneLowercaseOneNumeric') }}
                    </template>
                  </BaseTooltip>

                  <Transition
                    mode="out-in"
                    enter-active-class="animate-[zoomIn_0.3s]"
                    leave-active-class="animate-[zoomOut_0.3s]"
                  >
                    <button
                      v-if="newPasswordType === 'text'"
                      key="text"
                      type="button"
                      class="flex items-center"
                      data-testpl="input-show-password-btn"
                      @click="newPasswordType = 'password'"
                    >
                      <IconEye class="shrink-0" />
                    </button>

                    <button
                      v-else
                      type="button"
                      key="password"
                      class="flex items-center"
                      data-testpl="input-show-password-btn"
                      @click="newPasswordType = 'text'"
                    >
                      <IconCloseEye class="shrink-0" />
                    </button>
                  </Transition>
                </div>
              </template>
            </BaseInput>

            <BaseInput
              v-model="formData.confirmNewPassword"
              :error="v$.confirmNewPassword.$errors[0]?.$message"
              class="w-full"
              :placeholder="$t('reEnterNewPassword')"
              color="dark"
              :type="confirmNewPasswordType"
              autocomplete="off"
              data-testpl="set-password-drawer-confirm-new-input"
            >
              <template #append>
                <Transition
                  mode="out-in"
                  enter-active-class="animate-[zoomIn_0.3s]"
                  leave-active-class="animate-[zoomOut_0.3s]"
                >
                  <button
                    v-if="confirmNewPasswordType === 'text'"
                    key="text"
                    type="button"
                    class="flex items-center"
                    data-testpl="input-show-password-btn"
                    @click="confirmNewPasswordType = 'password'"
                  >
                    <IconEye class="shrink-0" />
                  </button>

                  <button
                    v-else
                    type="button"
                    key="password"
                    class="flex items-center"
                    data-testpl="input-show-password-btn"
                    @click="confirmNewPasswordType = 'text'"
                  >
                    <IconCloseEye class="shrink-0" />
                  </button>
                </Transition>
              </template>
            </BaseInput>
          </div>

          <BaseButton
            type="submit"
            class="w-full"
            :loading="userStore.setPasswordLoading"
            :disabled="!route.query.code || !route.query.id"
            data-testpl="set-password-drawer-reset-btn"
          >
            {{ $t('resetPassword') }}
          </BaseButton>
        </form>
      </div>
    </template>
  </BaseDialog>
</template>
