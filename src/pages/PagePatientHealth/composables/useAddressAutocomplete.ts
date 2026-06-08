import { useGoogleAutocomplete } from '@/composables/useGoogleAutocomplete';
import { type MaybeRefOrGetter, toValue } from 'vue';

type AddressFields = {
  line1: string;
  city: string;
  state_code: string;
  zip: string;
};

export const useAddressAutocomplete = () => {
  const { autocomplete } = useGoogleAutocomplete();

  const autocompleteAddressForm = (
    input: HTMLInputElement,
    form: MaybeRefOrGetter<AddressFields>,
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
