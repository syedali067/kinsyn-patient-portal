import type {
  SessionInfoResponse,
  LoginPayload,
  LoginResponse,
  ResetPasswordPayload,
  SetPasswordPayload,
  SignUpPayload,
  GetPaymentMethodsResponse,
  UserUpdatePayload,
  AddressPayload,
  ChangePasswordPayload,
  LoginTOTPResponse,
  UserTOTPVerifyResponse,
  UserTOTPDisableResponse,
  UserGetTotpSecretResponse,
} from './types';
import { useApi } from '@/composables/useApi';
import type { Response } from '@/types/response';
import type { AuthMethod, Profile } from '@/types/user';
import { useMemoize } from '@vueuse/core';

const getSessionInfo = useMemoize(() => {
  return useApi<Response<SessionInfoResponse>>('/api/v1/users/session-info').post();
});

const getProfile = useMemoize(() => {
  return useApi<Response<Profile>>('/api/v1/profile').get();
});

const login = (payload?: LoginPayload) => {
  return useApi<LoginResponse | LoginTOTPResponse>('/actions/users/login').post(payload);
};

const resetPassword = (payload: ResetPasswordPayload) => {
  return useApi<{ message: string }>('/api/v1/users/forgot-password').post(payload);
};

const setPassword = (payload: SetPasswordPayload) => {
  return useApi<{ status: string }>('/actions/users/set-password').post(payload);
};

const changePassword = (payload: ChangePasswordPayload) => {
  return useApi<Response<{ status: string }>>('/api/v1/users/update-password').post(payload);
};

const signUp = (payload: SignUpPayload) => {
  return useApi<Response<SessionInfoResponse>>('/api/v1/users/register').post(payload);
};

const getPaymentMethods = useMemoize(() => {
  return useApi<Response<GetPaymentMethodsResponse>>('/api/v2/profile/payment-methods').get();
});

const updateProfile = (payload: UserUpdatePayload) => {
  return useApi<Response<Profile>>(`/api/v1/profile`).put(payload);
};

const setPrimaryPaymentMethod = (payload: { paymentSourceId: string }) => {
  return useApi<Response<[]>>('/api/v2/profile/primary-payment-method').put(payload);
};

const createPaymentMethod = (token: string) => {
  return useApi<Response<[]>>('/api/v2/profile/create-payment-method').post({ token });
};

const deletePaymentMethod = (payload: { paymentSourceId: string }) => {
  return useApi<Response<[]>>('/api/v2/profile/payment-method').delete(payload);
};

const postAddress = (payload: AddressPayload) => {
  return useApi<Response<[]>>('/actions/users/save-address').post(payload);
};

const uploadPhoto = (payload: FormData) => {
  return useApi<Response<string>>('/api/v1/document/photo').post(payload);
};

const verifyTotp = (code: string) => {
  return useApi<Response<UserTOTPVerifyResponse>>('/api/v1/users/verify-totp').post({ code });
};

const disableTotp = () => {
  return useApi<Response<UserTOTPDisableResponse>>('/api/v1/users/disable-totp').post();
};

const getAuthMethods = () => {
  return useApi<Response<AuthMethod[]>>('/api/v1/users/get-auth-methods').get();
};

const getTOTPSecret = () => {
  return useApi<Response<UserGetTotpSecretResponse>>('/api/v1/users/get-totp-secret').get();
};

const sendEmailVerification = (email: string, name?: string) => {
  return useApi<Response<boolean>>('/api/v1/users/send-email-verification', {
    toastOptions: { displayError: false },
  }).post({ email, name });
};

const completeOnboarding = () => {
  return useApi<Response<{ success: boolean }>>('/api/v1/profile/complete-onboarding').put();
};

export const apiUser = {
  getSessionInfo,
  getProfile,
  login,
  resetPassword,
  setPassword,
  signUp,
  getPaymentMethods,
  updateProfile,
  setPrimaryPaymentMethod,
  createPaymentMethod,
  deletePaymentMethod,
  postAddress,
  changePassword,
  uploadPhoto,
  verifyTotp,
  disableTotp,
  getAuthMethods,
  getTOTPSecret,
  sendEmailVerification,
  completeOnboarding,
};
