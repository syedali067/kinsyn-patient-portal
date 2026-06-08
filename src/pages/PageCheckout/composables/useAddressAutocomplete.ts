import { useGoogleAutocomplete } from '@/composables/useGoogleAutocomplete';
import type { CartAddress } from '@/types/cart';
import { type MaybeRefOrGetter, toValue } from 'vue';

export const useAddressAutocomplete = () => {
  const { autocomplete } = useGoogleAutocomplete();

  const autocompleteAddressForm = (
    input: HTMLInputElement,
    form: MaybeRefOrGetter<CartAddress>,
  ) => {
    const formValue = toValue(form);

    autocomplete(input, (places) => {
      formValue.line1 = [places.streetNumber?.longName, places.route?.longName]
        .filter(Boolean)
        .join(' ');

      formValue.city = places.locality?.longName ?? '';
      formValue.state_code = places.administrativeAreaLevel1?.shortName ?? '';

      formValue.zip = [places.postalCode?.longName, places.postalCodeSuffix?.longName]
        .filter(Boolean)
        .join('-');
    });
  };

  return {
    autocompleteAddressForm,
  };
};
