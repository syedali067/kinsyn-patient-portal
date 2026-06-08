<script setup lang="ts">
import IconApple from '@/assets/icons/apple.svg?component';
import IconCloseEye from '@/assets/icons/close-eye.svg?component';
import IconEye from '@/assets/icons/eye.svg?component';
import IconGoogle from '@/assets/icons/google.svg?component';
import IconHelp from '@/assets/icons/help.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseCheckbox from '@/components/BaseCheckbox/BaseCheckbox.vue';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import BaseOtpInput from '@/components/BaseOtpInput/BaseOtpInput.vue';
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
import BaseTooltip from '@/components/BaseTooltip/BaseTooltip.vue';
import { useEmailVerification } from '@/composables/useEmailVerification';
import { maskDoubleName } from '@/composables/useMaskOptions';
import { useValidator } from '@/composables/useValidator';
import { releaseFlags } from '@/config/releaseFlags';
import { EMAIL_VERIFICATION_CODE_LENGTH } from '@/constants/emailVerification';
import { useToastStore } from '@/stores/toast';
import { useUserStore } from '@/stores/user';
import { useVuelidate } from '@vuelidate/core';
import { sameAs } from '@vuelidate/validators';
import { startCase } from 'lodash-es';
import { vMaska } from 'maska/vue';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const emit = defineEmits<{
  login: [];
}>();

const { t } = useI18n();
const { emailRules, passwordRules, firstNameRules, lastNameRules, verificationCodeRules } =
  useValidator();
const toastStore = useToastStore();
const userStore = useUserStore();
const { appleAuthEnabled, googleAuthEnabled } = releaseFlags;

const router = useRouter();

const formData = reactive<{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  verificationCode: string;
  termsAndConditionsAccepted: boolean;
  consentEmailGeneralMarketing: boolean;
}>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  verificationCode: '',
  termsAndConditionsAccepted: false,
  consentEmailGeneralMarketing: false,
});

const passwordType = ref<'text' | 'password'>('password');

const checkboxValidation = useVuelidate(
  {
    termsAndConditionsAccepted: {
      required: sameAs(true),
    },
  },
  formData,
  { $scope: false },
);

const formValidation = useVuelidate(
  {
    firstName: firstNameRules,
    lastName: lastNameRules,
    email: emailRules,
    password: passwordRules,
    verificationCode: verificationCodeRules,
  },
  formData,
  { $scope: false },
);

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const isGoogleOAuth = params.get('oauth') === 'google';

  if (!isGoogleOAuth) return;

  const cleanUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, '', cleanUrl);

  try {
    await Promise.all([userStore.getSessionInfo(false), userStore.getProfile(false)]);

    if (userStore.redirectRoute) {
      await router.push(userStore.redirectRoute);
    }
  } catch (error) {
    console.error(error);
  }
});

const onSubmit = async () => {
  const [formValid, checkboxValid] = await Promise.all([
    formValidation.value.$validate(),
    checkboxValidation.value.$validate(),
  ]);

  if (!formValid || !checkboxValid) {
    return;
  }

  await userStore.signUp({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    password: formData.password,
    verificationCode: formData.verificationCode,
    source: 'checkout',
    consent: {
      consentEmailGeneralMarketing: formData.consentEmailGeneralMarketing,
      consentEmailPersonalizedQuiz: formData.consentEmailGeneralMarketing,
    },
  });
};

const {
  sendEmailVerification,
  sendEmailVerificationLoading,
  isEmailVerificationAlreadySent,
  canSendEmailVerification,
  remaining,
  cleanup,
} = useEmailVerification();

const verifyEmail = async () => {
  if (!(await formValidation.value.email.$validate())) {
    return;
  }

  const response = await sendEmailVerification(formData.email, formData.firstName);

  if (response) {
    toastStore.addToast({
      type: 'success',
      text: t('emailVerificationCodeSent'),
    });

    if (isEmailVerificationAlreadySent.value) {
      formData.verificationCode = '';
    }
  }
};

const onCompleteCode = () => {
  formValidation.value.verificationCode.$validate();
};

const handleGoogleAuth = async () => {
  if (!(await checkboxValidation.value.$validate())) {
    return;
  }

  userStore.socialAuth('google');
};

const isSendCodeButtonDisabled = computed(() => {
  return !formData.email || formValidation.value.email.$error || !canSendEmailVerification.value;
});

const time = computed(() =>
  remaining.value < 60 && remaining.value > 0 ? ` (${remaining.value}s)` : '',
);

onUnmounted(() => cleanup());
</script>

<template>
  <div class="flex flex-col gap-24" data-testpl="checkout-registration">
    <h2 data-testpl="checkout-registration-title">
      {{ $t('firstYouLlNeedAnAccountWithUs') }}
    </h2>

    <form class="grid grid-cols-2 gap-12" @submit.prevent="onSubmit">
      <BaseInput
        v-model.trim="formData.firstName"
        v-maska="maskDoubleName"
        :error="formValidation.firstName.$errors[0]?.$message"
        :placeholder="startCase($t('legalFirstName'))"
        autocomplete="off"
        data-testpl="checkout-registration-first-name-input"
      />

      <BaseInput
        v-model.trim="formData.lastName"
        v-maska="maskDoubleName"
        :error="formValidation.lastName.$errors[0]?.$message"
        :placeholder="startCase($t('legalLastName'))"
        autocomplete="off"
        data-testpl="checkout-registration-last-name-input"
      />

      <BaseInput
        v-model.trim="formData.email"
        :error="formValidation.email.$errors[0]?.$message"
        class="col-span-full"
        :placeholder="$t('email')"
        type="email"
        name="email"
        autocomplete="off"
        data-testpl="checkout-registration-email-input"
      />

      <BaseOtpInput
        v-if="isEmailVerificationAlreadySent"
        v-model="formData.verificationCode"
        name="verificationCode"
        size="48"
        class="col-span-full"
        :length="EMAIL_VERIFICATION_CODE_LENGTH"
        :error="formValidation.verificationCode.$errors[0]?.$message"
        data-testpl="checkout-registration-verification-code-input"
        @complete="onCompleteCode"
      />

      <BaseInput
        v-model="formData.password"
        :error="formValidation.password.$errors[0]?.$message"
        class="col-span-full"
        :placeholder="$t('password')"
        color="dark"
        :type="passwordType"
        name="password"
        autocomplete="off"
        data-testpl="checkout-registration-password-input"
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
          </div>
        </template>
      </BaseInput>

      <BaseCheckbox
        v-model="formData.termsAndConditionsAccepted"
        :error="checkboxValidation.termsAndConditionsAccepted.$errors[0]?.$message"
        class="col-span-full mt-12"
      >
        <p
          class="text-12 text-secondary-text"
          data-testpl="checkout-registration-terms-and-conditions"
        >
          {{ $t('byCreatingAnAccountUsingEmailOrGoogleIAgreeToThe') }}
          <a class="underline" href="/terms-and-conditions" target="_blank">
            {{ $t('termsConditions') }}
          </a>
          {{ $t('andAcknowledgeThe') }}
          <a class="underline" href="/privacy-policy" target="_blank">
            {{ $t('privacyPolicy') }}
          </a>
        </p>
      </BaseCheckbox>

      <BaseCheckbox v-model="formData.consentEmailGeneralMarketing" class="col-span-full">
        <p class="text-12 text-secondary-text" data-testpl="checkout-registration-consent-email">
          {{ $t('yesILikeToReceivePersonalizedMarketingEmails') }}
        </p>
      </BaseCheckbox>

      <BaseButton
        type="button"
        class="col-span-full mt-12"
        data-testpl="checkout-registration-send-code-btn"
        size="48"
        :theme="isEmailVerificationAlreadySent ? 'outline' : 'solid'"
        :disabled="isEmailVerificationAlreadySent ? isSendCodeButtonDisabled : false"
        :loading="sendEmailVerificationLoading"
        @click="verifyEmail"
      >
        {{ isEmailVerificationAlreadySent ? $t('sendNewCode') : $t('verifyEmailFirst') }}
        <span v-if="time" data-testpl="checkout-registration-send-code-time">
          {{ time }}
        </span>
      </BaseButton>

      <BaseButton
        v-if="isEmailVerificationAlreadySent"
        type="submit"
        class="col-span-full"
        data-testpl="checkout-registration-submit-form-btn"
        :loading="userStore.signUpLoading"
      >
        {{ $t('createAccount') }}
      </BaseButton>
    </form>

    <template v-if="googleAuthEnabled || appleAuthEnabled">
      <p class="flex w-full items-center gap-24" data-testpl="checkout-registration-or">
        <BaseSeparator class="bg-bone" />
        <span class="text-secondary-text text-14">
          {{ $t('or') }}
        </span>
        <BaseSeparator class="bg-bone" />
      </p>

      <div class="flex flex-col gap-12" data-testpl="checkout-registration-alternative">
        <BaseButton
          v-if="googleAuthEnabled"
          theme="outline"
          :loading="userStore.loginLoading"
          @click="handleGoogleAuth"
          data-testpl="checkout-registration-alternative-google-btn"
        >
          <template #prepend>
            <IconGoogle class="size-20" />
          </template>
          {{ $t('continueWith') }} Google
        </BaseButton>

        <BaseButton
          v-if="appleAuthEnabled"
          theme="outline"
          data-testpl="checkout-registration-alternative-apple-btn"
        >
          <template #prepend>
            <IconApple class="size-20" />
          </template>
          {{ $t('continueWith') }} Apple
        </BaseButton>
      </div>
    </template>

    <p class="text-14 flex justify-center gap-4" data-testpl="checkout-registration-have-account">
      <span>{{ $t('doYouHaveAnAccount') }}</span>

      <button
        class="text-link-text font-medium"
        type="button"
        data-testpl="checkout-registration-login-btn"
        @click="emit('login')"
      >
        {{ $t('login') }}
      </button>
    </p>
  </div>
</template>
