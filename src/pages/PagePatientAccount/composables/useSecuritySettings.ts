import { apiUser } from '@/api/user';
import type { BaseInputType } from '@/components/BaseInput/types.ts';
import { useValidator } from '@/composables/useValidator.ts';
import { useToastStore } from '@/stores/toast';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useSecuritySettings = () => {
  const toastStore = useToastStore();
  const { passwordRules } = useValidator();
  const { t } = useI18n();
  const loading = ref(false);
  const isEditMode = ref(false);

  const formData = reactive<{
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const passwordTypes = reactive({
    currentPassword: 'password' as BaseInputType,
    newPassword: 'password' as BaseInputType,
    confirmNewPassword: 'password' as BaseInputType,
  });

  const clearForm = () => {
    formData.currentPassword = '';
    formData.newPassword = '';
    formData.confirmNewPassword = '';
  };

  const rules = {
    currentPassword: { required },
    newPassword: passwordRules,
    confirmNewPassword: {
      sameAs: helpers.withMessage(
        t('mustMatchTheNewPassword'),
        (value: string) => value === formData.newPassword,
      ),
    },
  };

  const v$ = useVuelidate(rules, formData, { $scope: false });

  const handleUpdatePassword = async () => {
    const isValid = await v$.value.$validate();

    if (!isValid) {
      return;
    }

    if (formData.confirmNewPassword !== formData.newPassword) {
      v$.value.confirmNewPassword.$touch();
      return;
    }

    try {
      loading.value = true;

      const response = await apiUser.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.statusCode.value !== 200) {
        return;
      }

      toastStore.addToast({
        type: 'success',
        text: response.data.value?.message,
      });

      formData.currentPassword = '';
      formData.newPassword = '';
      formData.confirmNewPassword = '';
      v$.value.$reset();
      isEditMode.value = false;
    } finally {
      loading.value = false;
    }
  };

  const handleCancelEditMode = () => {
    isEditMode.value = false;
    clearForm();
  };

  return {
    formData,
    clearForm,
    v$,
    loading,
    handleUpdatePassword,
    passwordTypes,
    isEditMode,
    handleCancelEditMode,
  };
};
