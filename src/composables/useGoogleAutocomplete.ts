import { Loader } from '@googlemaps/js-api-loader';
import { camelCase } from 'lodash-es';

type Places = Record<string, { longName: string; shortName: string }>;

export const useGoogleAutocomplete = () => {
  const autocomplete = async (input: HTMLInputElement, cb: (options: Places) => void) => {
    const placesAutocompleteService = await new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places'],
      language: 'en',
    }).importLibrary('places');

    if (!placesAutocompleteService) {
      return;
    }

    const autocompleteInstance = new placesAutocompleteService.Autocomplete(input, {
      componentRestrictions: { country: ['us'] },
      fields: ['address_components', 'geometry'],
      types: ['address'],
    });

    autocompleteInstance?.addListener('place_changed', () => {
      const places = autocompleteInstance
        .getPlace()
        .address_components?.reduce(
          (acc: Places, curr: { long_name: string; short_name: string; types: string[] }) => {
            return {
              ...acc,
              [camelCase(curr.types[0])]: { longName: curr.long_name, shortName: curr.short_name },
            };
          },
          {},
        );

      if (!places) {
        return;
      }

      cb(places);
    });
  };

  return {
    autocomplete,
  };
};
