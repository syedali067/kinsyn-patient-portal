import { apiUser } from '@/api/user';
import type { AuthMethod } from '@/types/user';
import { computed, ref } from 'vue';

export const useTotp = () => {
  const authMethods = ref<AuthMethod[]>([]);

  const fetchAuthMethodsLoading = ref(false);

  const fetchAuthMethods = async () => {
    fetchAuthMethodsLoading.value = true;

    try {
      const response = await apiUser.getAuthMethods();

      authMethods.value = response.data.value?.data || [];
    } finally {
      fetchAuthMethodsLoading.value = false;
    }
  };

  const secret = ref<string | null>(null);
  const qrImage = ref<string | null>(null);
  const fetchTotpSecretLoading = ref(false);

  const fetchTotpSecret = async () => {
    fetchTotpSecretLoading.value = true;
    try {
      const response = await apiUser.getTOTPSecret();

      secret.value = response.data.value?.data.secret || null;
      if (response.data.value?.data.qr) {
        const base64 = btoa(decodeURIComponent(encodeURIComponent(response.data.value.data.qr)));
        qrImage.value = `data:image/svg+xml;base64,${base64}`;
      }
    } finally {
      fetchTotpSecretLoading.value = false;
    }
  };

  const verifyCodeLoading = ref(false);

  const verifyCode = async (code: string) => {
    verifyCodeLoading.value = true;

    try {
      const response = await apiUser.verifyTotp(code);
      await fetchAuthMethods();

      return response;
    } finally {
      verifyCodeLoading.value = false;
    }
  };

  const isTotpEnabled = computed(() => {
    return authMethods.value.includes('TOTP');
  });

  const disableTotpLoading = ref(false);

  const disableTotp = async () => {
    disableTotpLoading.value = true;

    try {
      await apiUser.disableTotp();
      await fetchAuthMethods();
    } finally {
      disableTotpLoading.value = false;
    }
  };

  return {
    fetchAuthMethods,
    fetchAuthMethodsLoading,
    authMethods,
    secret,
    qrImage,
    fetchTotpSecretLoading,
    fetchTotpSecret,
    verifyCodeLoading,
    verifyCode,
    isTotpEnabled,
    disableTotpLoading,
    disableTotp,
  };
};
