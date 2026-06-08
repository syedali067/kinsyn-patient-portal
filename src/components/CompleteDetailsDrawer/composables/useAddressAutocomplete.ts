import type { LivingAddress } from '../types';
import { useGoogleAutocomplete } from '@/composables/useGoogleAutocomplete';
import { type MaybeRefOrGetter, toValue } from 'vue';

export const useAddressAutocomplete = () => {
  const { autocomplete } = useGoogleAutocomplete();

  const autocompleteAddressForm = (
    input: HTMLInputElement,
    form: MaybeRefOrGetter<LivingAddress>,
  ) => {
    const formValue = toValue(form);

    autocomplete(input, (places) => {
      formValue.line = [places.streetNumber?.longName, places.route?.longName]
        .filter(Boolean)
        .join(' ');

      formValue.city = places.locality?.longName ?? '';
      formValue.state = places.administrativeAreaLevel1?.shortName ?? '';

      formValue.postalCode = [places.postalCode?.longName, places.postalCodeSuffix?.longName]
        .filter(Boolean)
        .join('-');
    });
  };

  return {
    autocompleteAddressForm,
  };
};
