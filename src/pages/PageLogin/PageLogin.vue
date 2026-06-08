<script setup lang="ts">
import IconApple from '@/assets/icons/apple.svg?component';
import IconCloseEye from '@/assets/icons/close-eye.svg?component';
import IconEye from '@/assets/icons/eye.svg?component';
import IconGoogle from '@/assets/icons/google.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
import DrawerCheckEmail from '@/components/DrawerCheckEmail/DrawerCheckEmail.vue';
import DrawerForgotPassword from '@/components/DrawerForgotPassword/DrawerForgotPassword.vue';
import DrawerPasswordChanged from '@/components/DrawerPasswordChanged/DrawerPasswordChanged.vue';
import DrawerSetPassword from '@/components/DrawerSetPassword/DrawerSetPassword.vue';
import { useValidator } from '@/composables/useValidator';
import { releaseFlags } from '@/config/releaseFlags';
import { useUserStore } from '@/stores/user';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, ref } from 'vue';
import { reactive, watch } from 'vue';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const { emailRules } = useValidator();
const userStore = useUserStore();
const { appleAuthEnabled, totp, googleAuthEnabled } = releaseFlags;

const formData = reactive<{
  email: string;
  password: string;
  totpCode: string;
}>({
  email: '',
  password: '',
  totpCode: '',
});

const passwordType = ref<'text' | 'password'>('password');

const isTotp = computed(() => userStore.isTotp && totp);

const drawers = ref({
  forgotPassword: false,
  checkEmail: false,
  setPassword: false,
  passwordChanged: false,
});

const validation = useVuelidate(
  {
    email: emailRules,
    password: { required },
  },
  formData,
  { $scope: false },
);

const totpValidation = useVuelidate(
  {
    totpCode: { required },
  },
  formData,
  { $scope: false },
);

const reset = () => {
  formData.email = '';
  formData.password = '';
  formData.totpCode = '';
  validation.value.$reset();
  totpValidation.value.$reset();
};

const backToLogin = () => {
  formData.totpCode = '';
  userStore.isTotp = false;
  totpValidation.value.$reset();
};

const onSubmit = async () => {
  if (!(await validation.value.$validate())) {
    return;
  }

  if (
    !(await userStore.login({
      loginName: formData.email,
      password: formData.password,
    }))
  ) {
    return;
  }

  if (!userStore.isTotp) {
    reset();
  }
};

const onVerifyTotp = async () => {
  if (!(await totpValidation.value.$validate())) {
    return;
  }

  if (await userStore.verifyTOTP(formData.totpCode)) {
    reset();
    return;
  }
};

const handleClose = async (value: boolean) => {
  if (value) return;
  await router.push({ name: 'Login' });
};

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const isGoogleOAuth = params.get('oauth') === 'google';

  if (!isGoogleOAuth) return;

  const cleanUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, '', cleanUrl);

  try {
    await Promise.all([userStore.getSessionInfo(false), userStore.getProfile(false)]);

    const route = userStore.redirectRoute;

    if (route) {
      if (typeof route === 'string') {
        window.location.href = route;
      } else {
        await router.push(route);
      }
    }
  } catch (error) {
    console.error(error);
  }
});

watch(
  () => route.params.type,
  (type) => {
    (Object.keys(drawers.value) as Array<keyof typeof drawers.value>).forEach((key) => {
      drawers.value[key] = false;
    });

    switch (type) {
      case 'forgot-password':
        drawers.value.forgotPassword = true;
        break;
      case 'check-email':
        drawers.value.checkEmail = true;
        break;
      case 'set-password':
        drawers.value.setPassword = true;
        break;
      case 'password-changed':
        drawers.value.passwordChanged = true;
        break;
      default:
        break;
    }
  },
  { immediate: true },
);
</script>

<template>
  <DrawerForgotPassword v-model:open="drawers.forgotPassword" @update:open="handleClose" />
  <DrawerCheckEmail v-model:open="drawers.checkEmail" @update:open="handleClose" />
  <DrawerSetPassword v-model:open="drawers.setPassword" @update:open="handleClose" />
  <DrawerPasswordChanged v-model:open="drawers.passwordChanged" @update:open="handleClose" />

  <div class="flex h-full flex-col" data-testpl="login">
    <div class="m-auto flex w-full max-w-424 flex-col gap-24" data-testpl="login-container">
      <h1 class="text-21 lg:text-26 font-secondary" data-testpl="login-title">
        <template v-if="isTotp">
          {{ $t('pleaseVerifyTOTPCode') }}
        </template>
        <template v-else>
          {{ $t('welcomeBack') }}
        </template>
      </h1>

      <form
        v-if="isTotp"
        class="flex flex-col gap-12"
        data-testpl="totp-form"
        @submit.prevent="onVerifyTotp"
      >
        <p>
          {{ $t('enterTotpCodeFromYourAuthenticatorApp') }}
        </p>

        <BaseInput
          v-model="formData.totpCode"
          :error="totpValidation.totpCode.$errors[0]?.$message"
          class="w-full"
          :placeholder="$t('totpCode')"
          name="totp"
          autocomplete="one-time-code"
          data-testpl="login-totp-input"
        />

        <BaseButton
          type="submit"
          class="mt-12 w-full"
          data-testpl="login-totp-form-btn"
          :loading="userStore.loginLoading"
        >
          {{ $t('verifyCode') }}
        </BaseButton>
      </form>

      <form
        v-else
        class="flex flex-col items-end gap-12"
        data-testpl="login-form"
        @submit.prevent="onSubmit"
      >
        <BaseInput
          v-model.trim="formData.email"
          :error="validation.email.$errors[0]?.$message"
          class="w-full"
          :placeholder="$t('email')"
          type="email"
          name="email"
          autocomplete="email"
          data-testpl="login-email-input"
        />

        <BaseInput
          v-model="formData.password"
          :error="validation.password.$errors[0]?.$message"
          class="w-full"
          :placeholder="$t('password')"
          :type="passwordType"
          name="password"
          autocomplete="current-password"
          data-testpl="login-password-input"
        >
          <template #append>
            <Transition
              mode="out-in"
              enter-active-class="animate-[zoomIn_0.3s]"
              leave-active-class="animate-[zoomOut_0.3s]"
            >
              <button
                v-if="passwordType === 'text'"
                key="text"
                type="button"
                class="flex items-center"
                data-testpl="input-show-password-btn"
                @click="passwordType = 'password'"
              >
                <IconEye class="shrink-0" />
              </button>

              <button
                v-else
                type="button"
                key="password"
                class="flex items-center"
                data-testpl="input-show-password-btn"
                @click="passwordType = 'text'"
              >
                <IconCloseEye class="shrink-0" />
              </button>
            </Transition>
          </template>
        </BaseInput>

        <RouterLink
          :to="{
            name: 'Login',
            params: {
              type: 'forgot-password',
            },
          }"
          class="text-link-text text-14 font-medium"
          data-testpl="login-forgot-password-btn"
        >
          {{ $t('forgotPassword') }}?
        </RouterLink>

        <BaseButton
          type="submit"
          class="mt-12 w-full"
          data-testpl="login-submit-form-btn"
          :loading="userStore.loginLoading"
        >
          {{ $t('login') }}
        </BaseButton>
      </form>

      <p
        v-if="googleAuthEnabled || appleAuthEnabled"
        class="flex w-full items-center gap-24"
        data-testpl="login-or"
      >
        <BaseSeparator class="bg-bone" />
        <span class="text-secondary-text text-14">
          {{ $t('or') }}
        </span>
        <BaseSeparator class="bg-bone" />
      </p>

      <BaseButton
        v-if="isTotp"
        theme="outline"
        :loading="userStore.loginGoogleLoading"
        data-testpl="login-back-to-login-btn"
        @click="backToLogin"
      >
        {{ $t('backToLogin') }}
      </BaseButton>

      <div
        v-if="(googleAuthEnabled || appleAuthEnabled) && !isTotp"
        class="flex flex-col gap-12"
        data-testpl="login-alternative"
      >
        <BaseButton
          v-if="googleAuthEnabled"
          theme="outline"
          :loading="userStore.loginGoogleLoading"
          data-testpl="login-alternative-google-btn"
          @click="userStore.socialAuth('google')"
        >
          <template #prepend>
            <IconGoogle class="size-20" />
          </template>
          {{ $t('continueWith') }} Google
        </BaseButton>

        <BaseButton
          v-if="appleAuthEnabled"
          theme="outline"
          data-testpl="login-alternative-apple-btn"
        >
          <template #prepend>
            <IconApple class="size-20" />
          </template>
          {{ $t('continueWith') }} Apple
        </BaseButton>
      </div>

      <p class="text-14 flex justify-center gap-4" data-testpl="login-first-time">
        <span>{{ $t('firstTimeHere') }}</span>

        <RouterLink
          :to="{ name: 'SignUp' }"
          class="text-link-text font-medium"
          data-testpl="login-first-btn"
        >
          {{ $t('createAnAccount') }}
        </RouterLink>
      </p>
    </div>
  </div>
</template>
