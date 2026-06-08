<script setup lang="ts">
import DrawerExplainer from './components/DrawerExplainer.vue';
import RegistrationFlowContent from './components/RegistrationFlowContent.vue';
import RxFlowContent from './components/RxFlowContent.vue';
import { useAddressAutocomplete } from './composables/useAddressAutocomplete';
import { useHealthData } from './composables/useHealthData';
import { useMammothRegistration } from './composables/useMammothRegistration';
import { apiIntegrations } from '@/api/integrations/mammoth/apiIntegrations';
import IconArrowLeft from '@/assets/icons/arrow-left.svg?component';
import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import IconExplainer from '@/assets/icons/explainer.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import MainLogo from '@/components/MainLogo/MainLogo.vue';
import { useMammothConditions } from '@/composables/useMammothConditions';
import { useMammothFields } from '@/composables/useMammothFields';
import { useToastStore } from '@/stores/toast';
import { useUserStore } from '@/stores/user';
import type { MammothFields } from '@/types/integration';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { computed, ref, watch, onMounted, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

const isShowed = defineModel<boolean>({ required: true });

const props = defineProps<{
  fields?: MammothFields;
}>();

const emit = defineEmits<{
  complete: [];
}>();

const { t } = useI18n();
const userStore = useUserStore();
const toastStore = useToastStore();
const { autocompleteAddressForm } = useAddressAutocomplete();
const { mammothRegistration, isMammothLoading } = useMammothRegistration();
const { isMammothFieldsLoading } = useMammothFields();
const { isMammothConditionsLoading } = useMammothConditions();
const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const rxFlowRef = ref<InstanceType<typeof RxFlowContent> | null>(null);
const registrationFlowRef = ref<InstanceType<typeof RegistrationFlowContent> | null>(null);
const showDrawerExplainer = ref(false);

const accountDetailsEditMode = computed(() => rxFlowRef.value?.accountDetailsEditMode ?? false);
const addressEditMode = computed(() => rxFlowRef.value?.addressEditMode ?? false);
const isEditMode = computed(() => accountDetailsEditMode.value || addressEditMode.value);

const {
  formData,
  v$,
  isRxFlow,
  genderOptions,
  updateProfileLoading,
  handleCancelAccountDetailsEdit,
  saveAccountDetails,
  handleSaveAccountDetails,
  handleCancelAddressEdit,
  initRxFlow,
} = useHealthData(toRef(props, 'fields'), accountDetailsEditMode);

const isIdentificationLoading = computed(() => {
  return (
    rxFlowRef.value?.isIdentificationLoading || registrationFlowRef.value?.isIdentificationLoading
  );
});

const isLoading = computed(() => {
  return (
    isMammothLoading.value ||
    isMammothFieldsLoading.value ||
    isMammothConditionsLoading.value ||
    isIdentificationLoading.value ||
    userStore.getProfileLoading ||
    updateProfileLoading.value
  );
});

const onSaveAccountDetails = async () => {
  const success = await handleSaveAccountDetails();
  if (success && rxFlowRef.value) {
    rxFlowRef.value.accountDetailsEditMode = false;
  }
};

const onCancelAccountDetailsEdit = () => {
  handleCancelAccountDetailsEdit();
  if (rxFlowRef.value) {
    rxFlowRef.value.accountDetailsEditMode = false;
  }
};

const onCancelAddressEdit = () => {
  handleCancelAddressEdit();
  if (rxFlowRef.value) {
    rxFlowRef.value.addressEditMode = false;
  }
};

const handleClick = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  if (!userStore.profile?.user.document || !userStore.profile?.user.idPicture) {
    toastStore.addToast({
      type: 'error',
      text: t('pleaseUploadYourIdentification'),
    });
    return;
  }

  await handleConfirm();
};

const handleConfirm = async () => {
  // Save profile and address before Mammoth registration (only for non-RxFlow)
  if (!isRxFlow.value) {
    await saveAccountDetails();
  }

  const dob =
    formData.year && formData.month && formData.day
      ? `${formData.year}-${String(formData.month).padStart(2, '0')}-${String(formData.day).padStart(2, '0')}`
      : '';

  const payload = {
    // To register in Mammoth, we remove all unnecessary characters.
    firstName: (userStore.profile?.user.firstName ?? '').replace(/[^a-zA-Z]/g, ''),
    lastName: (userStore.profile?.user.lastName ?? '').replace(/[^a-zA-Z]/g, ''),
    phone: formData.livingAddress.phone ?? '',
    gender: formData.gender,
    dob,
    livingAddresses: [
      {
        state: formData.livingAddress.state,
        city: formData.livingAddress.city,
        postalCode: formData.livingAddress.postalCode,
        line: formData.livingAddress.line,
        phone: formData.livingAddress.phone ?? '',
        isCurrent: true,
      },
    ],
  };

  const res = await mammothRegistration(payload);

  if (res) {
    await Promise.all([
      apiIntegrations.getMammothConditions.load(),
      apiIntegrations.getMammothFields.load(),
    ]);
    isShowed.value = false;
    emit('complete');
  }
};

// Watch for line input ref to setup autocomplete
watch(
  () => rxFlowRef.value?.localLineInputRef?.input || registrationFlowRef.value?.lineInputRef?.input,
  (input) => {
    if (!input) return;
    autocompleteAddressForm(input, formData.livingAddress);
  },
  { flush: 'post' },
);

watch(isShowed, async (newVal) => {
  if (newVal && userStore.profile?.user.document && userStore.profile?.user.idPicture) {
    await userStore.getProfile(false);
  }

  if (!newVal && rxFlowRef.value) {
    rxFlowRef.value.accountDetailsEditMode = false;
    rxFlowRef.value.addressEditMode = false;
  }
});

defineExpose({
  handleConfirm,
});

onMounted(() => {
  initRxFlow();
});
</script>

<template>
  <div>
    <BaseDialog
      v-model:open="isShowed"
      class="w-full"
      position="right"
      :closeBtn="false"
      data-testpl="complete-details-drawer"
    >
      <template #content>
        <div class="row items-start lg:mr-64 lg:ml-64">
          <figure
            v-if="greaterOrEqualLg"
            class="col-span-6 -mt-16 -ml-88 lg:-mt-24"
            data-testpl="complete-details-drawer-image"
          >
            <img
              src="@/assets/images/bg-complete-details.jpg"
              alt=""
              class="size-full object-cover"
            />
          </figure>

          <div
            class="flex w-full flex-col gap-24 lg:gap-32 lg:pl-40"
            :class="isRxFlow ? 'col-span-6' : 'col-span-5'"
            data-testpl="complete-details-drawer-content"
          >
            <div class="relative flex items-center">
              <BaseButton
                rounded
                color="gray"
                size="32"
                data-testpl="complete-details-drawer-back-btn"
                @click="isShowed = false"
              >
                <template #prepend>
                  <IconArrowLeft class="size-20" />
                </template>
              </BaseButton>

              <MainLogo
                v-if="!greaterOrEqualLg"
                data-testpl="complete-details-drawer-logo"
                class="absolute top-1/2 left-1/2 w-100 -translate-1/2"
              />
            </div>

            <RxFlowContent
              v-if="isRxFlow"
              ref="rxFlowRef"
              v-model:form-data="formData"
              :v$
              :update-profile-loading
              :gender-options
              @save-account-details="onSaveAccountDetails"
              @cancel-account-details-edit="onCancelAccountDetailsEdit"
              @cancel-address-edit="onCancelAddressEdit"
            />

            <RegistrationFlowContent
              v-else
              ref="registrationFlowRef"
              v-model:form-data="formData"
              :v$
              :gender-options
            />

            <BaseButton
              v-if="!isRxFlow"
              theme="link"
              color="brand"
              class="!normal-case"
              data-testpl="complete-details-drawer-why-do-we-ask-this-btn"
              @click="showDrawerExplainer = true"
            >
              {{ $t('whyDoWeAskThis') }}
              <template #append>
                <IconExplainer class="size-20 shrink-0" />
              </template>
            </BaseButton>

            <div
              class="flex w-full flex-col items-start justify-between gap-24 lg:flex-row lg:items-center"
            >
              <BaseButton
                :loading="isLoading"
                :disabled="isEditMode"
                class="ml-auto w-full sm:w-200"
                :class="isRxFlow ? 'lg:-mr-40' : 'lg:-mr-144'"
                data-testpl="complete-details-drawer-continue-btn"
                @click="handleClick"
              >
                {{ $t('confirm') }}
                <template #append>
                  <IconArrowRight class="size-20" />
                </template>
              </BaseButton>
            </div>
          </div>
        </div>
      </template>
    </BaseDialog>

    <DrawerExplainer v-model="showDrawerExplainer" />
  </div>
</template>
