import { EMAIL_VERIFICATION_CODE_LENGTH } from '@/constants/emailVerification';
import {
  required,
  minLength,
  maxLength,
  helpers,
  email,
  integer,
  minValue,
  maxValue,
  requiredIf,
} from '@vuelidate/validators';
import { parse, isValid, differenceInYears, isFuture, getDaysInMonth } from 'date-fns';
import { toRef } from 'vue';
import { useI18n } from 'vue-i18n';

export const useValidator = () => {
  const MIN_YEAR = 1900;

  const { t } = useI18n();

  // For first name: allows spaces for double names (e.g. "Mary Ann")
  const firstName = helpers.withMessage(
    () => t('onlyAlphabeticCharactersSpacesDash'),
    (value: string) => /^[A-Za-z'-\s]*$/.test(value),
  );

  // For last name: no spaces allowed
  const lastName = helpers.withMessage(
    () => t('onlyAlphabeticCharactersDash'),
    (value: string) => /^[A-Za-z'-]*$/.test(value),
  );

  const hasUppercase = helpers.withMessage(
    () => t('passwordMustContainUppercaseLetter'),
    (value: string) => /[A-Z]/.test(value),
  );

  const hasLowercase = helpers.withMessage(
    () => t('passwordMustContainLowercaseLetter'),
    (value: string) => /[a-z]/.test(value),
  );

  const hasNumber = helpers.withMessage(
    () => t('passwordMustContainNumericDigit'),
    (value: string) => /\d/.test(value),
  );

  const noSpaces = helpers.withMessage(
    () => t('passwordCannotContainSpaces'),
    (value: string) => !/\s/.test(value),
  );

  const date = helpers.withMessage(
    () => t('pleaseEnterValidDate'),
    (value: string) => {
      if (value.length !== 10) return false;
      const date = parse(value, 'MM/dd/yyyy', new Date());
      return isValid(date);
    },
  );

  const isNotFutureDate = helpers.withMessage(
    () => t('theDateCannotBeInTheFuture'),
    (value: string) => {
      if (value.length < 10) return true;
      const date = parse(value, 'MM/dd/yyyy', new Date());

      if (!isValid(date)) return true;
      return !isFuture(date);
    },
  );

  const oldDate = helpers.withMessage(
    () => t('theDateIsTooFarInThePast'),
    (value: string) => {
      if (value.length < 10) return true;
      const date = parse(value, 'MM/dd/yyyy', new Date());

      if (!isValid(date)) return true;

      const age = differenceInYears(new Date(), date);
      return age <= 100;
    },
  );

  const postalCode = helpers.withMessage(
    () => t('pleaseEnterAValidZipPostalCode'),
    (value: string) => /^\d{5}(-\d{4})?$/.test(value),
  );

  const dateValidation = (
    form: { day: string; month: string; year: string },
    type: 'dob' | 'expiryDateCard',
  ) => {
    const dayRef = toRef(form, 'day');
    const monthRef = toRef(form, 'month');
    const yearRef = toRef(form, 'year');

    const requireYearIf = helpers.withMessage(
      () => t('yearIsRequiredIfDayOrMonthIsEntered'),
      requiredIf(() => Boolean(dayRef.value || monthRef.value)),
    );
    const requireDayIf = helpers.withMessage(
      () => t('dayIsRequiredIfMonthOrYearIsEntered'),
      requiredIf(() => Boolean(monthRef.value || yearRef.value)),
    );
    const requireMonthIf = helpers.withMessage(
      () => t('monthIsRequiredIfDayOrYearIsEntered'),
      requiredIf(() => Boolean(dayRef.value || yearRef.value)),
    );

    // Day check: 1 ≤ day ≤ getDaysInMonth
    const validDay = helpers.withMessage(
      () => t('invalidDayForSelectedMonth'),
      helpers.withParams({ type: 'validDay' }, (dayVal: string, { month, year }) => {
        const d = Number(dayVal);
        const m = Number(month);
        const y = Number(year);
        if ([d, m, y].some((n) => isNaN(n))) return false;
        return d >= 1 && d <= getDaysInMonth(new Date(y, m - 1, 1));
      }),
    );

    // Checking full date: valid Date and not in the future
    const validDate = helpers.withMessage(
      () => t('theDateIsIncorrectOrItIsFromTheFuture'),
      helpers.withParams({ type: 'validDate' }, (_: string, { day, month, year }) => {
        const dt = parse(`${year}-${month}-${day}`, 'yyyy-MM-dd', new Date());
        return isValid(dt) && !isFuture(dt);
      }),
    );

    const isAdult = helpers.withMessage(
      () => t('ageMustBe18OrOlder'),
      helpers.withParams({ type: 'isAdult' }, (_: string, { day, month, year }) => {
        const dt = parse(`${year}-${month}-${day}`, 'yyyy-MM-dd', new Date());
        if (!isValid(dt)) return false;
        return differenceInYears(new Date(), dt) >= 18;
      }),
    );

    if (type === 'dob') {
      return {
        day: {
          requiredIf: requireDayIf,
          integer,
          minValue: minValue(1),
          maxValue: maxValue(31),
          validDay,
        },
        month: {
          requiredIf: requireMonthIf,
          integer,
          minValue: minValue(1),
          maxValue: maxValue(12),
        },
        year: {
          requiredIf: requireYearIf,
          integer,
          minValue: minValue(MIN_YEAR),
          maxValue: maxValue(new Date().getFullYear()),
          validDate,
          isAdult,
        },
      };
    } else {
      return {
        day: {
          required,
          integer,
          minValue: minValue(1),
          validDay,
        },
        month: {
          required,
          integer,
          minValue: minValue(1),
          maxValue: maxValue(12),
        },
        year: {
          required,
          integer,
          minValue: minValue(new Date().getFullYear()),
        },
      };
    }
  };

  const newCardRules = {
    cardNumber: {
      required,
      fullCard: helpers.withMessage(
        () => t('cardNumberMustBe16Digits'),
        (val: string) => {
          return val.replace(/\D/g, '').length === 16;
        },
      ),
    },
    nameCardHolder: { required },
    cvv: { required, integer, minLength: minLength(3), maxLength: maxLength(4) },
  };

  const passwordRules = {
    required: helpers.withMessage(() => t('pleaseEnterYourPassword'), required),
    minLength: minLength(6),
    maxLength: maxLength(30),
    hasUppercase,
    hasLowercase,
    hasNumber,
    noSpaces,
  };

  const verificationCodeRules = {
    required: helpers.withMessage(() => t('pleaseEnterYourVerificationCode'), required),
    minLength: minLength(EMAIL_VERIFICATION_CODE_LENGTH),
    maxLength: maxLength(EMAIL_VERIFICATION_CODE_LENGTH),
    alphaNumUppercase: helpers.withMessage(
      () => t('onlyAlphaNumericUppercaseAllowed'),
      (val: string) => /^[A-Z0-9]+$/.test(val),
    ),
  };

  const dateRules = {
    required,
    date,
    isNotFutureDate,
    oldDate,
  };

  const emailRules = {
    required: helpers.withMessage(() => t('pleaseEnterYourEmailAddress'), required),
    email: helpers.withMessage(() => t('pleaseEnterAValidEmailAddress'), email),
  };

  const firstNameRules = {
    required: helpers.withMessage(() => t('pleaseEnterYourFirstName'), required),
    minLength: minLength(2),
    maxLength: maxLength(35),
    firstName,
  };

  const lastNameRules = {
    required: helpers.withMessage(() => t('pleaseEnterYourLastName'), required),
    minLength: minLength(2),
    maxLength: maxLength(35),
    lastName,
  };

  const zipRules = {
    required: helpers.withMessage(() => t('pleaseEnterAValidZipPostalCode'), required),
    postalCode,
  };

  const phoneRules = {
    required: helpers.withMessage(() => t('pleaseEnterYourPhoneNumber'), required),
    minLength: helpers.withMessage(() => t('pleaseEnterAValidPhoneNumber'), minLength(12)),
  };

  const genderRules = {
    required: helpers.withMessage(() => t('pleaseSelectYourGender'), required),
  };

  return {
    firstName,
    lastName,
    passwordRules,
    dateRules,
    emailRules,
    dateValidation,
    newCardRules,
    firstNameRules,
    lastNameRules,
    zipRules,
    phoneRules,
    postalCode,
    verificationCodeRules,
    genderRules,
  };
};
