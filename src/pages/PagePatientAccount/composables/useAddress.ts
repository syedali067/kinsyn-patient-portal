import type AddressBlock from '../components/AddressBlock.vue';
import { useAddressAutocomplete } from './useAddressAutocomplete.ts';
import { useValidator } from '@/composables/useValidator';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { createSharedComposable } from '@vueuse/core';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useAddress = createSharedComposable(() => {
  const { t } = useI18n();
  const { autocompleteAddressForm } = useAddressAutocomplete();
  const { firstNameRules, lastNameRules, zipRules, phoneRules } = useValidator();

  const addressBlockComponent = ref<typeof AddressBlock | null>(null);

  const formData = reactive<{
    addressFirstName: string;
    addressLastName: string;
    city: string;
    state_code: string;
    line1: string;
    zip: string;
    apt: string;
    phone: string;
  }>({
    addressFirstName: '',
    addressLastName: '',
    city: '',
    state_code: '',
    line1: '',
    zip: '',
    apt: '',
    phone: '',
  });

  const rules = computed(() => {
    return {
      addressFirstName: firstNameRules,
      addressLastName: lastNameRules,
      city: {
        required: helpers.withMessage(() => t('pleaseEnterYourCity'), required),
      },
      state_code: {
        required: helpers.withMessage(() => t('pleaseSelectAState'), required),
      },
      line1: {
        required: helpers.withMessage(
          () => t('pleaseEnterYourStreetAddressAndHouseNumber'),
          required,
        ),
      },
      zip: zipRules,
      phone: phoneRules,
    };
  });

  onMounted(() => {
    const line1Input = addressBlockComponent.value?.line1InputComponent.input;
    if (!line1Input) return;
    autocompleteAddressForm(line1Input, formData);
  });

  const v$ = useVuelidate(rules, formData, { $scope: false });

  return {
    v$,
    formData,
    addressBlockComponent,
  };
});
