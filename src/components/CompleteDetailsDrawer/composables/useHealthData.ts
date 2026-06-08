import type { FormData, Rules } from '../types';
import type { MammothGender } from '@/api/integrations/mammoth/types';
import { useUserUpdate } from '@/composables/useUserUpdate';
import { useValidator } from '@/composables/useValidator';
import { useUserStore } from '@/stores/user';
import type { MammothFields } from '@/types/integration';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, reactive, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useHealthData = (
  fields: Ref<MammothFields | undefined>,
  accountDetailsEditMode: Ref<boolean>,
) => {
  const { t } = useI18n();
  const userStore = useUserStore();
  const { postalCode, phoneRules, dateValidation } = useValidator();
  const { updateProfile, updateProfileLoading } = useUserUpdate();

  const genderOptions = computed(() => [
    { value: 'male', label: t('male') },
    { value: 'female', label: t('female') },
  ]);

  const userGender = computed<MammothGender>(() => {
    if (userStore.profile?.user.gender === 'M') return 'male';
    else if (userStore.profile?.user.gender === 'F') return 'female';
    else return undefined;
  });

  const formData = reactive<FormData>({
    gender: userGender.value,
    day: userStore.profile?.user.dob?.toString().substring(6, 8) ?? '',
    month: userStore.profile?.user.dob?.toString().substring(4, 6) ?? '',
    year: userStore.profile?.user.dob?.toString().substring(0, 4) ?? '',
    livingAddress: {
      city: userStore.shippingAddress?.locality ?? '',
      state: userStore.shippingAddress?.administrativeArea ?? '',
      line: userStore.shippingAddress?.addressLine1 ?? '',
      postalCode: userStore.shippingAddress?.postalCode ?? '',
      phone: userStore.shippingAddress?.phone ?? '',
      apt: userStore.shippingAddress?.addressLine3 ?? '',
    },
  });

  const isRxFlow = ref(false);

  const rules = computed(() => {
    const r: Rules = {};

    r.gender = { required };

    // Always validate dob fields (needed for RxFlow edit mode too)
    const shouldValidateDob = !fields.value?.filledFields.dob || accountDetailsEditMode.value;

    if (shouldValidateDob) {
      Object.assign(
        r,
        dateValidation(
          {
            day: formData.day,
            month: formData.month,
            year: formData.year,
          },
          'dob',
        ),
      );
    }

    r.livingAddress = {};

    r.livingAddress.city = { required };
    r.livingAddress.state = { required };
    r.livingAddress.line = { required };
    r.livingAddress.postalCode = { postalCode, required };
    r.livingAddress.phone = phoneRules;

    return r;
  });

  const v$ = useVuelidate(rules, formData, { $scope: false });

  // Account details methods
  const handleCancelAccountDetailsEdit = () => {
    formData.gender = userGender.value;
    formData.day = userStore.profile?.user.dob?.toString().substring(6, 8) ?? '';
    formData.month = userStore.profile?.user.dob?.toString().substring(4, 6) ?? '';
    formData.year = userStore.profile?.user.dob?.toString().substring(0, 4) ?? '';
  };

  const saveAccountDetails = async () => {
    const dob = `${formData.year}${formData.month}${formData.day}`;
    const gender = formData.gender === 'male' ? 'M' : 'F';

    const payload = {
      user: {
        phone: formData.livingAddress.phone,
        dob,
        gender,
      },
    };

    const result = await updateProfile(userStore.userId as number, payload);

    if (result) {
      userStore.profile = result;
    }

    return result;
  };

  const handleSaveAccountDetails = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) return false;

    const result = await saveAccountDetails();
    return !!result;
  };

  // Address methods
  const handleCancelAddressEdit = () => {
    formData.livingAddress.city = userStore.shippingAddress?.locality ?? '';
    formData.livingAddress.state = userStore.shippingAddress?.administrativeArea ?? '';
    formData.livingAddress.line = userStore.shippingAddress?.addressLine1 ?? '';
    formData.livingAddress.postalCode = userStore.shippingAddress?.postalCode ?? '';
    formData.livingAddress.phone = userStore.shippingAddress?.phone ?? '';
    formData.livingAddress.apt = userStore.shippingAddress?.addressLine3 ?? '';
  };

  const handleSaveAddress = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) return false;
  };

  // Check if all required fields are filled for RxFlow
  const initRxFlow = () => {
    if (
      userStore.shippingAddress?.locality &&
      userStore.shippingAddress?.administrativeArea &&
      userStore.shippingAddress?.addressLine1 &&
      userStore.shippingAddress?.postalCode &&
      userStore.shippingAddress?.phone &&
      userStore.profile?.user.firstName &&
      userStore.profile?.user.lastName &&
      userStore.profile?.user.dob &&
      userStore.profile?.user.gender
    ) {
      isRxFlow.value = true;
    }
  };

  return {
    formData,
    v$,
    isRxFlow,
    genderOptions,
    updateProfileLoading,
    handleCancelAccountDetailsEdit,
    saveAccountDetails,
    handleSaveAccountDetails,
    handleCancelAddressEdit,
    handleSaveAddress,
    initRxFlow,
  };
};
