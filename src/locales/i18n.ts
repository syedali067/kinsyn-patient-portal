import en from './en';
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en },
});

/**
 * This is a global function that can be used to translate strings.
 * It is used in the formatters to translate strings.
 */
export const { t } = i18n.global;

export default i18n;
