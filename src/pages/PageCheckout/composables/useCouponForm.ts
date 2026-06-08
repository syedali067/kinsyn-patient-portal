import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { createSharedComposable } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useCouponForm = createSharedComposable(() => {
  const { t } = useI18n();

  const couponForm = ref({
    coupon: '',
  });

  const couponFormRules = computed(() => ({
    coupon: {
      required: helpers.withMessage(() => t('pleaseEnterAValidDiscountCode'), required),
    },
  }));

  const couponValidation = useVuelidate(couponFormRules, couponForm, {
    $scope: false,
  });

  return {
    couponForm,
    couponValidation,
  };
});
