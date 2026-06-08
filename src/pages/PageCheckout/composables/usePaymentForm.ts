import { useChargebee } from '@/composables/useChargebee';
import { usePaymentMethods } from '@/composables/usePaymentMethods';
import type { PaymentMethodType } from '@/types/payment';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { createSharedComposable } from '@vueuse/core';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export const usePaymentForm = createSharedComposable(() => {
  const { t } = useI18n();
  const { getCardToken } = useChargebee();
  const { defaultPaymentMethod } = usePaymentMethods();
  const isNewCard = ref(true);

  const paymentForm = ref<{
    tokenId: string | null;
    paymentSourceId: string | null;
    paymentIntentId: string | null;
    paymentMethodType: PaymentMethodType | undefined;
  }>({
    tokenId: null,
    paymentSourceId: null,
    paymentIntentId: null,
    paymentMethodType: 'CARD',
  });

  const paymentIdIsRequired = helpers.withMessage(t('addOrSelectPaymentMethod'), () => {
    return !!(
      paymentForm.value.tokenId ||
      paymentForm.value.paymentSourceId ||
      paymentForm.value.paymentIntentId
    );
  });

  const paymentRules = computed(() => ({
    tokenId: {
      required: paymentIdIsRequired,
    },
    paymentSourceId: {
      required: paymentIdIsRequired,
    },
    paymentIntentId: {
      required: paymentIdIsRequired,
    },
    paymentMethodType: { required },
  }));

  const paymentValidation = useVuelidate(paymentRules, paymentForm, {
    $scope: false,
  });

  const validateNewCard = () =>
    new Promise(async (resolve) => {
      if (paymentForm.value.paymentMethodType !== 'CARD') {
        resolve(true);
        return;
      }

      if (!isNewCard.value) {
        resolve(true);
        return;
      }

      try {
        paymentForm.value.tokenId = await getCardToken();
        resolve(true);
      } catch {
        resolve(false);
      }
    });

  watch(defaultPaymentMethod, (defaultPaymentMethod) => {
    paymentForm.value.paymentSourceId = defaultPaymentMethod?.externalRef || null;
  });

  return {
    paymentForm,
    isNewCard,
    paymentValidation,
    validateNewCard,
  };
});
