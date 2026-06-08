import AddressForm from '../components/AddressForm.vue';
import { useAddressAutocomplete } from './useAddressAutocomplete';
import { useValidator } from '@/composables/useValidator';
import { useUserStore } from '@/stores/user';
import type { CartAddress } from '@/types/cart';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required, requiredUnless, email } from '@vuelidate/validators';
import { createSharedComposable } from '@vueuse/core';
import { ref, watch, nextTick, computed } from 'vue';
import { useI18n } from 'vue-i18n';

export const useAddressForm = createSharedComposable(() => {
  const { t } = useI18n();
  const userStore = useUserStore();

  const { autocompleteAddressForm } = useAddressAutocomplete();
  const { firstNameRules, lastNameRules, zipRules } = useValidator();

  const shippingAddressFormComponent = ref<typeof AddressForm | null>(null);
  const billingAddressFormComponent = ref<typeof AddressForm | null>(null);

  const isBillingAddressSame = ref(true);

  const shippingAddressForm = ref<CartAddress>({
    addressFirstName:
      userStore.shippingAddress?.addressFirstName || userStore.profile?.user.firstName || '',
    addressLastName:
      userStore.shippingAddress?.addressLastName || userStore.profile?.user.lastName || '',
    phone: userStore.profile?.user.addresses.shippingAddress?.phone ?? '',
    line1: userStore.shippingAddress?.addressLine1 ?? '',
    line2: userStore.shippingAddress?.addressLine2 ?? '',
    city: userStore.shippingAddress?.locality ?? '',
    zip: userStore.shippingAddress?.postalCode ?? '',
    state_code: userStore.shippingAddress?.administrativeArea ?? '',
    email: userStore.isGuest ? '' : (userStore.profile?.user.email ?? ''),
  });

  const shippingAddressRules = computed(() => ({
    addressFirstName: firstNameRules,
    addressLastName: lastNameRules,
    line1: {
      required: helpers.withMessage(
        () => t('pleaseEnterYourStreetAddressAndHouseNumber'),
        required,
      ),
    },
    city: {
      required: helpers.withMessage(() => t('pleaseEnterYourCity'), required),
    },
    zip: zipRules,
    state_code: {
      required: helpers.withMessage(() => t('pleaseSelectAState'), required),
    },
    email: {
      required: helpers.withMessage(
        () => t('pleaseEnterYourEmailAddress'),
        requiredUnless(!userStore.isGuest),
      ),
      email: helpers.withMessage(() => t('pleaseEnterAValidEmailAddress'), email),
    },
  }));

  const shippingAddressValidation = useVuelidate(shippingAddressRules, shippingAddressForm, {
    $scope: false,
  });

  const billingAddressForm = ref<CartAddress>({
    addressFirstName:
      userStore.billingAddress?.addressFirstName || userStore.profile?.user.firstName || '',
    addressLastName:
      userStore.billingAddress?.addressLastName || userStore.profile?.user.lastName || '',
    phone: userStore.billingAddress?.phone ?? '',
    line1: userStore.billingAddress?.addressLine1 ?? '',
    line2: userStore.billingAddress?.addressLine2 ?? '',
    city: userStore.billingAddress?.locality ?? '',
    zip: userStore.billingAddress?.postalCode ?? '',
    state_code: userStore.billingAddress?.administrativeArea ?? '',
    email: userStore.isGuest ? '' : (userStore.profile?.user.email ?? ''),
  });

  const billingAddressRules = computed(() => ({
    addressFirstName: {
      required: helpers.withMessage(
        () => t('pleaseEnterYourFirstName'),
        requiredUnless(isBillingAddressSame),
      ),
      minLength: !isBillingAddressSame.value ? firstNameRules.minLength : {},
      firstName: !isBillingAddressSame.value ? firstNameRules.firstName : {},
    },
    addressLastName: {
      required: helpers.withMessage(
        () => t('pleaseEnterYourLastName'),
        requiredUnless(isBillingAddressSame),
      ),
      minLength: !isBillingAddressSame.value ? lastNameRules.minLength : {},
      lastName: !isBillingAddressSame.value ? lastNameRules.lastName : {},
    },
    line1: {
      required: helpers.withMessage(
        () => t('pleaseEnterYourStreetAddressAndHouseNumber'),
        requiredUnless(isBillingAddressSame),
      ),
    },
    city: {
      required: helpers.withMessage(
        () => t('pleaseEnterYourCity'),
        requiredUnless(isBillingAddressSame),
      ),
    },
    zip: {
      required: helpers.withMessage(
        () => t('pleaseEnterAValidZipPostalCode'),
        requiredUnless(isBillingAddressSame),
      ),
      shape: !isBillingAddressSame.value ? zipRules.postalCode : {},
    },
    state_code: {
      required: helpers.withMessage(
        () => t('pleaseSelectAState'),
        requiredUnless(isBillingAddressSame),
      ),
    },
    email: {
      required: helpers.withMessage(
        () => t('pleaseEnterYourEmailAddress'),
        requiredUnless(!userStore.isGuest || isBillingAddressSame),
      ),
      email: helpers.withMessage(() => t('pleaseEnterAValidEmailAddress'), email),
    },
  }));

  const billingAddressValidation = useVuelidate(billingAddressRules, billingAddressForm, {
    $scope: false,
  });

  watch(shippingAddressFormComponent, (shippingAddressFormComponent) => {
    const shippingLine1Input = shippingAddressFormComponent?.line1InputComponent.input;
    if (!shippingLine1Input) return;
    autocompleteAddressForm(shippingLine1Input, shippingAddressForm);
  });

  watch(isBillingAddressSame, async (isBillingAddressSame) => {
    if (isBillingAddressSame) return;
    await nextTick();
    const billingLine1Input = billingAddressFormComponent.value?.line1InputComponent.input;
    if (!billingLine1Input) return;
    autocompleteAddressForm(billingLine1Input, billingAddressForm);
  });

  watch(
    () => userStore.profile?.user.email,
    (email) => {
      if (!email) return;
      shippingAddressForm.value.email = email;
      billingAddressForm.value.email = email;
    },
  );

  return {
    isBillingAddressSame,
    shippingAddressForm,
    shippingAddressValidation,
    billingAddressForm,
    billingAddressValidation,
    shippingAddressFormComponent,
    billingAddressFormComponent,
  };
});
