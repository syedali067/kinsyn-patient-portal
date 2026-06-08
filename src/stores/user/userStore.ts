import { apiUser } from '@/api/user';
import type {
  LoginPayload,
  ResetPasswordPayload,
  SetPasswordPayload,
  SignUpPayload,
  LoginResponse,
  LoginTOTPResponse,
} from '@/api/user/types';
import { useToastStore } from '@/stores/toast';
import type { Profile, SessionUserRole } from '@/types/user';
import { formatAddress } from '@/utils/formatters';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute, type RouteLocationRaw } from 'vue-router';

export const useUserStore = defineStore('user', () => {
  const toastStore = useToastStore();
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();

  const baseUrl = window.location.origin;
  const role = ref<SessionUserRole>('guest');
  const profile = ref<Profile>();
  const userId = ref<number>();
  const loginLoading = ref(false);
  const getProfileLoading = ref(false);
  const loginGoogleLoading = ref(false);
  const loginAppleLoading = ref(false);
  const resetPasswordLoading = ref(false);
  const setPasswordLoading = ref(false);
  const signUpLoading = ref(false);
  const isTotp = ref(false);

  const isLoggedIn = computed(() => !!userId.value);

  const fullName = computed(() => {
    const nameParts = [
      profile.value?.user.firstName,
      profile.value?.user.middleName,
      profile.value?.user.lastName,
    ];

    return nameParts.filter(Boolean).join(' ').trim() || t('notSpecified');
  });

  const email = computed(() => profile.value?.user.email);

  const avatar = computed(() => profile.value?.avatar);

  const addresses = computed(() => {
    return profile.value?.user.addresses;
  });
  const shippingAddress = computed(() => addresses.value?.shippingAddress);

  const billingAddress = computed(() => addresses.value?.billingAddress);

  const formattedShippingAddress = computed(() => formatAddress(shippingAddress.value));
  const formattedBillingAddress = computed(() => formatAddress(billingAddress.value));

  const isUserTOTPResponse = (response: LoginResponse | LoginTOTPResponse) => {
    return 'authMethod' in response && response.authMethod === 'craft\\auth\\methods\\TOTP';
  };

  const isGuest = computed(() => role.value === 'guest');
  const isProviderManager = computed(() => role.value === 'providers');
  const isProvider = computed(() => role.value === 'providerUsers');
  const isPatient = computed(() => role.value === 'patients');

  const redirectRoute = computed<string | RouteLocationRaw | false>(() => {
    if (route.name === 'Checkout') {
      return false;
    }

    if (route.query.forward && typeof route.query.forward === 'string') {
      return `${baseUrl}${route.query.forward}`;
    }

    switch (role.value) {
      case 'patients':
        return { name: 'PatientHealth' };
      case 'providers':
      case 'providerUsers':
      case 'customerSupport':
      case 'customerSupportManagers':
      case 'medicalSupport':
      case 'medicalSupportManagers':
        return `${baseUrl}/staff`;
      default:
        return false;
    }
  });

  const clearSession = () => {
    profile.value = undefined;
    userId.value = undefined;
    sessionStorage.clear();
  };

  const goToRedirectRoute = async () => {
    if (!redirectRoute.value) return;

    if (typeof redirectRoute.value === 'string') {
      window.location.href = redirectRoute.value;
    } else {
      await router.push(redirectRoute.value);
    }
  };

  const getSessionInfo = async (cache = true) => {
    const getSessionInfoFunction = cache ? apiUser.getSessionInfo : apiUser.getSessionInfo.load;
    const response = await getSessionInfoFunction();

    const { id, isGuest, groups } = response.data.value?.data ?? {};

    userId.value = id;
    // This condition guarantees that only one role will be true
    role.value = isGuest ? 'guest' : (groups?.[0] ?? 'guest');

    return response;
  };

  const socialAuth = (provider: 'google' | 'apple' = 'google') => {
    const loadingMap = {
      apple: loginAppleLoading,
      google: loginGoogleLoading,
    };

    const loadingRef = loadingMap[provider] || loginLoading;
    loadingRef.value = true;

    const loginUrl = new URL('/actions/social-login/auth/login', window.location.origin);
    const returnUrl = `${window.location.href.split('?')[0]}?oauth=${provider}`;
    loginUrl.searchParams.set('provider', provider);
    loginUrl.searchParams.set('redirect', returnUrl);

    window.location.href = loginUrl.toString();
  };

  const getProfile = async (cache = true) => {
    try {
      getProfileLoading.value = true;
      const request = cache ? apiUser.getProfile : apiUser.getProfile.load;
      const getProfileResponse = await request();
      profile.value = getProfileResponse.data.value?.data ?? undefined;
      return getProfileResponse;
    } finally {
      getProfileLoading.value = false;
    }
  };

  const login = async (payload: LoginPayload) => {
    try {
      loginLoading.value = true;
      const response = await apiUser.login(payload);

      if (response.statusCode.value !== 200) {
        return false;
      }

      if (response.data.value && isUserTOTPResponse(response.data.value)) {
        isTotp.value = true;

        return true;
      }

      const [sessionInfoSuccess, profileSuccess] = await Promise.all([
        getSessionInfo(false)
          .then(() => true)
          .catch(() => false),
        getProfile(false)
          .then(() => true)
          .catch(() => false),
      ]);

      if (!sessionInfoSuccess || !profileSuccess) {
        return false;
      }

      await goToRedirectRoute();

      return true;
    } finally {
      loginLoading.value = false;
    }
  };

  const verifyTOTP = async (code: string) => {
    try {
      loginLoading.value = true;
      const response = await apiUser.verifyTotp(code);

      if (response.statusCode.value !== 200) {
        if (response.data.value?.data.message) {
          toastStore.addToast({
            type: 'error',
            text: response.data.value.data.message,
          });
        }
        return false;
      }

      const [sessionInfoSuccess, profileSuccess] = await Promise.all([
        getSessionInfo(false)
          .then(() => true)
          .catch(() => false),
        getProfile(false)
          .then(() => true)
          .catch(() => false),
      ]);

      if (!sessionInfoSuccess || !profileSuccess) {
        return false;
      }

      await goToRedirectRoute();
      return true;
    } finally {
      loginLoading.value = false;
    }
  };

  const resetPassword = async (payload: ResetPasswordPayload) => {
    try {
      resetPasswordLoading.value = true;

      const response = await apiUser.resetPassword(payload);

      if (response.statusCode.value !== 200) {
        return false;
      }

      await router.push({
        params: {
          type: 'check-email',
        },
      });

      return true;
    } finally {
      resetPasswordLoading.value = false;
    }
  };

  const setPassword = async (payload: SetPasswordPayload) => {
    try {
      setPasswordLoading.value = true;

      const response = await apiUser.setPassword(payload);

      if (response.statusCode.value !== 200) {
        return false;
      }

      await router.push({
        name: 'Login',
        params: {
          type: 'password-changed',
        },
      });

      return true;
    } finally {
      setPasswordLoading.value = false;
    }
  };

  const signUp = async (payload: SignUpPayload) => {
    try {
      signUpLoading.value = true;

      const response = await apiUser.signUp(payload);

      if (response.statusCode.value !== 200) {
        return false;
      }

      await Promise.all([getSessionInfo(false), getProfile(false)]);

      await goToRedirectRoute();

      return true;
    } finally {
      signUpLoading.value = false;
    }
  };

  watch(
    role,
    (value) => {
      if (value === 'guest') clearSession();
    },
    { immediate: true },
  );

  return {
    role,
    profile,
    userId,
    getProfileLoading,
    getSessionInfo,
    getProfile,
    login,
    loginLoading,
    loginAppleLoading,
    loginGoogleLoading,
    isLoggedIn,
    isGuest,
    isProviderManager,
    isProvider,
    isPatient,
    fullName,
    email,
    avatar,
    resetPassword,
    resetPasswordLoading,
    setPassword,
    setPasswordLoading,
    signUp,
    signUpLoading,
    redirectRoute,
    addresses,
    shippingAddress,
    billingAddress,
    formattedShippingAddress,
    formattedBillingAddress,
    isTotp,
    isUserTOTPResponse,
    verifyTOTP,
    socialAuth,
    baseUrl,
  };
});
