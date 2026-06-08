<script setup lang="ts">
// TODO: commented for first launch
import IconClip from '@/assets/icons/clip.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import BaseSpinner from '@/components/BaseSpinner/BaseSpinner.vue';
import ModalConfirm from '@/components/ModalConfirm/ModalConfirm.vue';
import { useTotp } from '@/composables/useTotp.ts';
import { useToastStore } from '@/stores/toast';
import { useClipboard } from '@vueuse/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const toastStore = useToastStore();

const showForm = ref(false);
const showDisableModal = ref(false);
const verificationCode = ref('');

const {
  fetchAuthMethods,
  fetchAuthMethodsLoading,
  secret,
  qrImage,
  fetchTotpSecretLoading,
  fetchTotpSecret,
  verifyCodeLoading,
  verifyCode,
  isTotpEnabled,
  disableTotpLoading,
  disableTotp,
} = useTotp();

fetchAuthMethods();

const { copy } = useClipboard();

const disable2FA = async () => {
  showForm.value = false;
  await disableTotp();
  showDisableModal.value = false;
};

const enable2FA = async () => {
  showForm.value = true;

  await Promise.all([fetchAuthMethods(), fetchTotpSecret()]);
};

const handleVerifyCode = async () => {
  const response = await verifyCode(verificationCode.value);

  if (response.statusCode.value === 200) {
    showForm.value = false;

    toastStore.addToast({
      type: 'success',
      text: t('totpVerifiedSuccessfully'),
    });
  } else {
    // Verification code is wrong, we need to fetch the secret and QR again
    fetchTotpSecret();
  }
};

const copyToClipboard = () => {
  if (secret.value) {
    copy(secret.value);
    toastStore.addToast({
      type: 'success',
      text: t('copiedToClipboard'),
    });
  }
};
</script>

<template>
  <section class="rounded-8 flex flex-col gap-24 bg-white p-24">
    <div class="flex w-full flex-col gap-24">
      <div class="flex items-center justify-between gap-24">
        <p>{{ $t('setUpTOTP') }}</p>
      </div>

      <div v-if="isTotpEnabled">
        <p class="text-14 mb-16 text-gray-600">
          {{ t('totpIsCurrentlyEnabledDoYouWantToDisableTOTP') }}
        </p>
        <BaseButton
          theme="solid"
          @click.prevent="showDisableModal = true"
          :loading="disableTotpLoading || fetchAuthMethodsLoading"
        >
          {{ t('disableTOTP') }}
        </BaseButton>
      </div>
      <div v-else>
        <p class="text-14 mb-16 text-gray-600">
          {{ t('improveYourAccountsSecurityByAddingVerification') }}
        </p>
        <BaseButton
          theme="solid"
          @click.prevent="enable2FA"
          :loading="fetchTotpSecretLoading || fetchAuthMethodsLoading"
        >
          {{ t('setUpTOTP') }}
        </BaseButton>
      </div>

      <div v-if="showForm">
        <p class="text-18 mb-16 font-semibold">
          {{ t('step') }} 1: {{ t('installAnAuthenticatorAppSuchAs') }}
        </p>
        <ul class="text-14 mb-16 flex list-inside list-disc flex-col gap-5">
          <li>
            <a
              href="https://duo.com/product/multi-factor-authentication-mfa/duo-mobile-app#download-duo-mobile"
              target="_blank"
              rel="noreferrer"
              class="text-primary-500 font-semibold underline"
            >
              Duo Mobile
            </a>
            (iOS and Android)
          </li>
          <li>
            Google Authenticator (
            <a
              href="https://apps.apple.com/th/app/google-authenticator/id388497605?l=en"
              target="_blank"
              rel="noreferrer"
              class="text-primary-500 font-semibold underline"
            >
              iOS
            </a>
            and
            <a
              href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en-US"
              target="_blank"
              rel="noreferrer"
              class="text-primary-500 font-semibold underline"
            >
              Android
            </a>
            )
          </li>
          <li>
            <a
              href="https://www.microsoft.com/en-US/security/mobile-authenticator-app"
              target="_blank"
              rel="noreferrer"
              class="text-primary-500 font-semibold underline"
            >
              Microsoft Authenticator
            </a>
            (iOS and Android)
          </li>
        </ul>

        <p class="text-14 mb-16">
          {{ t('orUsePasswordManagerWithBuiltInAuthenticationSupport') }}:
        </p>
        <ul class="text-14 mb-16 flex list-inside list-disc flex-col gap-16">
          <li>
            <a
              href="https://1password.com"
              target="_blank"
              rel="noreferrer"
              class="text-primary-500 font-semibold underline"
            >
              1Password
            </a>
            <span class="lowercase"> ({{ t('allPlatformsAndBrowsers') }}) </span>
          </li>
          <li>
            <a
              href="https://bitwarden.com"
              target="_blank"
              rel="noreferrer"
              class="text-primary-500 font-semibold underline"
            >
              Bitwarden
            </a>
            <span class="lowercase"> ({{ t('allPlatformsAndBrowsers') }}) </span>
          </li>
        </ul>

        <hr class="mb-20 text-gray-200" />

        <div class="flex flex-col gap-24">
          <div class="flex flex-col gap-4">
            <p class="text-18 mb-10 font-semibold">
              {{ t('step') }} 2: {{ t('createOneTimePassword') }}
            </p>
            <div class="flex flex-col">
              <p class="text-14">
                {{ t('withinTheAppCreateNewTimeBasedOneTimePassword') }}
              </p>
            </div>
          </div>

          <div class="rounded-8 mb-20 flex flex-col gap-16 border p-16">
            <BaseSpinner v-if="fetchTotpSecretLoading" class="size-36" />
            <template v-else>
              <img v-if="qrImage" :src="qrImage" alt="" class="size-135" />
              <div class="flex gap-16">
                <BaseInput
                  v-if="secret"
                  v-model="secret"
                  :placeholder="t('secretCode')"
                  size="48"
                  disabled
                  :label="t('key')"
                  class="w-3/4"
                />
                <BaseButton theme="solid" @click.prevent="copyToClipboard" size="48">
                  {{ t('copy') }}
                  <template #prepend>
                    <IconClip class="size-20" />
                  </template>
                </BaseButton>
              </div>
            </template>
          </div>
        </div>

        <hr class="mb-20 text-gray-200" />

        <div class="flex flex-col gap-24">
          <div class="flex flex-col gap-4">
            <p class="text-18 mb-16 font-semibold">
              {{ t('step') }} 3: {{ t('verifyWithAnAuthenticationCode') }}
            </p>
            <div class="flex flex-col">
              <p class="text-14">
                {{ t('enterTheAuthenticationCodeProvidedByTheApp') }}
              </p>
            </div>
          </div>

          <div class="flex gap-16">
            <BaseInput
              v-model="verificationCode"
              :placeholder="t('verificationCode')"
              size="48"
              :label="t('verificationCode')"
              class="w-3/4"
            />
            <BaseButton
              size="48"
              theme="solid"
              color="dark"
              :loading="verifyCodeLoading"
              @click="handleVerifyCode"
            >
              {{ t('verifyCode') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
    <ModalConfirm
      v-model="showDisableModal"
      :title="$t('disableTOTP')"
      :text="$t('areYouSureYouWantToDisableTOTP')"
      :confirm-button-label="$t('disableTOTP')"
      @confirm="disable2FA"
    />
  </section>
</template>
