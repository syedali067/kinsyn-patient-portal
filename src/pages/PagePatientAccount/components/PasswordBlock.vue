<script setup lang="ts">
import { useSecuritySettings } from '../composables/useSecuritySettings.ts';
import IconCloseEye from '@/assets/icons/close-eye.svg?component';
import IconEye from '@/assets/icons/eye.svg?component';
import IconHelp from '@/assets/icons/help.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import BaseTooltip from '@/components/BaseTooltip/BaseTooltip.vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');
const {
  v$,
  formData,
  handleUpdatePassword,
  loading,
  handleCancelEditMode,
  passwordTypes,
  isEditMode,
} = useSecuritySettings();
</script>

<template>
  <section data-testpl="account-password" class="rounded-8 flex flex-col gap-24 bg-white p-24">
    <div class="flex w-full flex-col gap-24">
      <div class="flex items-center justify-between gap-24">
        <p>{{ $t('password') }}</p>

        <BaseButton
          v-if="isEditMode && greaterOrEqualLg"
          data-testpl="account-password-cancel-btn"
          theme="outline"
          size="37"
          @click="handleCancelEditMode"
        >
          {{ $t('cancel') }}
        </BaseButton>

        <BaseButton
          v-if="!isEditMode && greaterOrEqualLg"
          data-testpl="account-password-update-btn"
          theme="outline"
          size="37"
          @click="isEditMode = true"
        >
          {{ $t('update') }}
        </BaseButton>
      </div>

      <template v-if="!isEditMode">
        <div data-testpl="account-password-current" class="flex flex-col gap-8">
          <p class="text-10 text-beige font-medium uppercase">
            {{ $t('currentPassword') }}
          </p>
          <div class="flex items-center justify-between gap-12">
            <p>••••••••••••</p>
          </div>
        </div>
      </template>

      <template v-else>
        <div data-testpl="account-password-edit" class="flex flex-col gap-24">
          <BaseInput
            v-model="formData.currentPassword"
            :placeholder="$t('currentPassword')"
            :type="passwordTypes.currentPassword"
            :error="v$.currentPassword.$errors[0]?.$message"
          >
            <template #append>
              <Transition
                mode="out-in"
                enter-active-class="animate-[zoomIn_0.3s]"
                leave-active-class="animate-[zoomOut_0.3s]"
              >
                <button
                  v-if="passwordTypes.currentPassword === 'text'"
                  key="text"
                  type="button"
                  class="flex items-center"
                  data-testpl="input-show-password-btn"
                  @click="passwordTypes.currentPassword = 'password'"
                >
                  <IconEye class="shrink-0" />
                </button>

                <button
                  v-else
                  type="button"
                  key="password"
                  class="flex items-center"
                  data-testpl="input-show-password-btn"
                  @click="passwordTypes.currentPassword = 'text'"
                >
                  <IconCloseEye class="shrink-0" />
                </button>
              </Transition>
            </template>
          </BaseInput>

          <BaseInput
            v-model="formData.newPassword"
            :placeholder="$t('newPassword')"
            :type="passwordTypes.newPassword"
            :error="v$.newPassword.$errors[0]?.$message"
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
                    v-if="passwordTypes.newPassword === 'text'"
                    key="text"
                    type="button"
                    class="flex items-center"
                    data-testpl="input-show-password-btn"
                    @click="passwordTypes.newPassword = 'password'"
                  >
                    <IconEye class="shrink-0" />
                  </button>

                  <button
                    v-else
                    type="button"
                    key="password"
                    class="flex items-center"
                    data-testpl="input-show-password-btn"
                    @click="passwordTypes.newPassword = 'text'"
                  >
                    <IconCloseEye class="shrink-0" />
                  </button>
                </Transition>
              </div>
            </template>
          </BaseInput>

          <BaseInput
            v-model="formData.confirmNewPassword"
            :placeholder="$t('confirmNewPassword')"
            :type="passwordTypes.confirmNewPassword"
            :error="v$.confirmNewPassword.$errors[0]?.$message"
          >
            <template #append>
              <Transition
                mode="out-in"
                enter-active-class="animate-[zoomIn_0.3s]"
                leave-active-class="animate-[zoomOut_0.3s]"
              >
                <button
                  v-if="passwordTypes.confirmNewPassword === 'text'"
                  key="text"
                  type="button"
                  class="flex items-center"
                  data-testpl="input-show-password-btn"
                  @click="passwordTypes.confirmNewPassword = 'password'"
                >
                  <IconEye class="shrink-0" />
                </button>

                <button
                  v-else
                  type="button"
                  key="password"
                  class="flex items-center"
                  data-testpl="input-show-password-btn"
                  @click="passwordTypes.confirmNewPassword = 'text'"
                >
                  <IconCloseEye class="shrink-0" />
                </button>
              </Transition>
            </template>
          </BaseInput>
        </div>
      </template>

      <div class="flex flex-col gap-12">
        <BaseButton
          v-if="isEditMode && !greaterOrEqualLg"
          data-testpl="account-password-cancel-btn"
          theme="outline"
          size="37"
          @click="handleCancelEditMode"
        >
          {{ $t('cancel') }}
        </BaseButton>

        <BaseButton
          v-if="isEditMode"
          data-testpl="account-password-save-btn"
          size="37"
          :loading
          class="w-full lg:w-fit"
          @click="handleUpdatePassword"
        >
          {{ $t('saveChanges') }}
        </BaseButton>

        <BaseButton
          v-if="!isEditMode && !greaterOrEqualLg"
          data-testpl="account-password-update-btn"
          theme="outline"
          size="37"
          @click="isEditMode = true"
        >
          {{ $t('update') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>
