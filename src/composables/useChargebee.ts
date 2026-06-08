import type {
  ChargebeeInstance,
  ChargebeeChangeEvent,
  ChargebeeFieldError,
  ChargebeeFieldType,
} from '@/types/chargebee';
import { CardComponent } from '@chargebee/chargebee-js-vue-wrapper';
import { createSharedComposable } from '@vueuse/core';
import { computed, ref } from 'vue';

export const useChargebee = createSharedComposable(() => {
  const chargebeeInstance = ref<ChargebeeInstance>();
  const cardComponent = ref<InstanceType<typeof CardComponent> | null>(null);

  if (!chargebeeInstance.value) {
    chargebeeInstance.value = window.Chargebee?.init({
      site: import.meta.env.VITE_CHARGEBEE_API_SITE,
      publishableKey: import.meta.env.VITE_CHARGEBEE_PUBLISHABLE_KEY,
    });
  }

  const cardErrors = ref<Partial<Record<ChargebeeFieldType, ChargebeeFieldError>>>({});
  const isCardValid = computed(() => Object.values(cardErrors.value).filter(Boolean).length === 0);

  const onCardChange = (status: ChargebeeChangeEvent) => {
    cardErrors.value = { ...cardErrors.value, [status.field]: status.error };
  };

  const getCardToken = async () => {
    const data = await cardComponent.value?.tokenize();
    return data.token;
  };

  const cardSettings = {
    icon: false,
    styles: {
      base: {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#222222',

        '::placeholder': {
          color: '#6c6a66',
        },
      },
    },
    classes: {
      focus: 'focus',
      invalid: 'invalid',
    },
  };

  return {
    chargebeeInstance,
    cardComponent,
    cardErrors,
    isCardValid,
    onCardChange,
    getCardToken,
    cardSettings,
  };
});
