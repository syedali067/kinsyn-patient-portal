<script setup lang="ts">
import type { FormData } from '../types';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect/BaseSelect.vue';
import BaseSpinner from '@/components/BaseSpinner/BaseSpinner.vue';
import { maskDay, maskPhone, maskPostalCode, maskYear } from '@/composables/useMaskOptions';
import { useStates } from '@/composables/useStates';
import { useStaticData } from '@/composables/useStaticData';
import IdentificationBlock from '@/pages/PagePatientAccount/components/IdentificationBlock.vue';
import { useUserStore } from '@/stores/user';
import { formatPhoneNumber } from '@/utils/formatters';
import type { Validation } from '@vuelidate/core';
import { vMaska } from 'maska/vue';
import { computed, ref } from 'vue';

const formData = defineModel<FormData>('formData', { required: true });

const props = defineProps<{
  v$: Validation;
  updateProfileLoading: boolean;
  genderOptions: { value: string; label: string }[];
}>();

defineEmits<{
  saveAccountDetails: [];
  cancelAccountDetailsEdit: [];
  cancelAddressEdit: [];
}>();

const userStore = useUserStore();
const { months } = useStaticData();
const { states } = useStates();
const accountDetailsEditMode = ref(false);
const addressEditMode = ref(false);
const searchQuery = ref('');
const identificationBlockRef = ref<InstanceType<typeof IdentificationBlock> | null>(null);
const localLineInputRef = ref<InstanceType<typeof BaseInput> | null>(null);

const filteredOptions = computed(() => {
  if (!searchQuery.value) return states.value;

  const query = searchQuery.value.toLowerCase();
  return states.value?.filter(
    (option) =>
      option.label?.toLowerCase().includes(query) ||
      option.code === formData.value.livingAddress.state,
  );
});

const isIdentificationLoading = computed(() => {
  return (
    identificationBlockRef.value?.documentLoading || identificationBlockRef.value?.idPictureLoading
  );
});

const formattedLivingAddress = computed(() => {
  const { line, apt, city, state, postalCode, phone } = formData.value.livingAddress;
  const addressLines: string[] = [];

  // Line 1: Street + Apartment
  if (line) addressLines.push(apt ? `${line} ${apt}` : line);

  // Line 2: City, State PostalCode / USA
  const locationPart = [city, state].filter(Boolean).join(', ');
  const locationWithZip = [locationPart, postalCode].filter(Boolean).join(' ');
  if (locationWithZip) addressLines.push(`${locationWithZip} / USA`);

  // Line 3: Phone
  if (phone) addressLines.push(formatPhoneNumber(phone) ?? phone);

  return addressLines;
});

const handleSelectOpen = (isOpen: boolean) => {
  if (!isOpen) {
    searchQuery.value = '';
  }
};

const onSaveAddressChanges = async () => {
  if (!(await props.v$.$validate())) return;
  addressEditMode.value = false;
};

defineExpose({
  identificationBlockRef,
  localLineInputRef,
  isIdentificationLoading,
  accountDetailsEditMode,
  addressEditMode,
});
</script>

<template>
  <p class="text-26 font-secondary max-w-400 break-words" data-testpl="rx-flow-description">
    <span class="text-beige" data-testpl="first-name">
      {{ userStore.profile?.user.firstName }},
    </span>
    <span class="lowercase">
      {{ $t('toDisplayYourHealthDataWeNeedToVerifyYourInformation') }}
    </span>
  </p>

  <!-- Account Details View -->
  <div
    v-if="!accountDetailsEditMode"
    class="bg-site-bg rounded-8 flex flex-col gap-24 p-24"
    data-testpl="rx-flow-account-details-view"
  >
    <div class="flex flex-col gap-12">
      <div class="flex items-center justify-between gap-12">
        <p>{{ $t('accountDetails') }}</p>
        <BaseButton
          theme="link"
          class="!capitalize"
          @click="accountDetailsEditMode = true"
          data-testpl="rx-flow-account-details-edit-btn"
        >
          {{ $t('edit') }}
        </BaseButton>
      </div>
      <p class="text-12 text-secondary-text">
        {{ $t('pleaseEnsureYourNameAndBirthDateMatchTheIDProvided') }}
      </p>
    </div>

    <div class="flex flex-col gap-8" data-testpl="rx-flow-name-section">
      <p class="text-10 text-secondary-text">{{ $t('name') }}</p>
      <p class="text-14" data-testpl="full-name">{{ userStore.fullName }}</p>
    </div>

    <div class="flex flex-col gap-8" data-testpl="rx-flow-biological-sex-section">
      <p class="text-10 text-secondary-text">{{ $t('biologicalSex') }}</p>
      <p class="text-14" data-testpl="biological-sex">
        {{ userStore.profile?.user.gender === 'M' ? $t('male') : $t('female') }}
      </p>
    </div>

    <div class="flex flex-col gap-8" data-testpl="rx-flow-phone-number-section">
      <p class="text-10 text-secondary-text">{{ $t('phoneNumber') }}</p>
      <p class="text-14" data-testpl="phone-number">
        {{ formatPhoneNumber(userStore.profile?.user.phone) }}
      </p>
    </div>

    <div data-testpl="rx-flow-date-of-birth-section" class="flex flex-col gap-8">
      <p class="text-10 text-secondary-text">{{ $t('dateOfBirth') }}</p>
      <p v-if="userStore.profile?.user.dob" class="text-14" data-testpl="date-of-birth">
        {{ formData.month }}/{{ formData.day }}/{{ formData.year }}
      </p>
      <p v-else class="text-14">{{ $t('notSpecified') }}</p>
    </div>
  </div>

  <!-- Account Details Edit -->
  <div
    v-else
    class="bg-site-bg rounded-8 flex flex-col gap-24 p-24"
    data-testpl="rx-flow-account-details-edit-view"
  >
    <p>{{ $t('accountDetails') }}</p>

    <div class="flex items-center gap-16">
      <BaseInput
        :model-value="userStore.profile?.user.firstName ?? ''"
        class="w-full"
        disabled
        :placeholder="$t('firstName')"
        data-testpl="rx-flow-input-first-name"
      />
      <BaseInput
        :model-value="userStore.profile?.user.lastName ?? ''"
        class="w-full"
        disabled
        :placeholder="$t('lastName')"
        data-testpl="rx-flow-input-last-name"
      />
    </div>

    <div class="flex flex-col gap-12" data-testpl="rx-flow-biological-sex-section">
      <p>{{ $t('biologicalSex') }}</p>
      <p class="text-12 text-secondary-text">
        {{ $t('toEnsureAccurateLabResultsAndMedicalGuidance') }}
      </p>
      <BaseSelect
        v-model="formData.gender"
        :placeholder="$t('biologicalSex')"
        :options="genderOptions"
        :error="v$.gender.$errors[0]?.$message"
        data-testpl="rx-flow-select-biological-sex"
      />
    </div>

    <div class="flex flex-col gap-12" data-testpl="rx-flow-birth-date-section">
      <p>{{ $t('selectBirthDate') }}</p>
      <p class="text-12 text-secondary-text">
        {{ $t('signUpIsRestrictedTo18YearsOrOlder') }}
      </p>
      <div class="flex flex-col gap-16 lg:flex-row">
        <BaseSelect
          v-model.trim="formData.month"
          :placeholder="$t('month')"
          :error="v$.month?.$errors[0]?.$message"
          :options="months"
          data-testpl="rx-flow-select-month"
        />
        <BaseInput
          v-model.trim="formData.day"
          v-maska="maskDay"
          :placeholder="$t('day')"
          data-testpl="rx-flow-input-day"
          :error="v$.day?.$errors[0]?.$message"
          class="w-full"
        />
        <BaseInput
          v-model.trim="formData.year"
          v-maska="maskYear"
          :placeholder="$t('year')"
          data-testpl="rx-flow-input-year"
          :error="v$.year?.$errors[0]?.$message"
          class="w-full"
        />
      </div>
    </div>

    <div class="flex items-center gap-12">
      <BaseButton
        theme="solid"
        class="w-fit"
        :loading="updateProfileLoading"
        data-testpl="rx-flow-save-account-details-btn"
        @click="$emit('saveAccountDetails')"
      >
        {{ $t('saveChanges') }}
      </BaseButton>
      <BaseButton
        theme="outline"
        class="w-fit"
        :disabled="updateProfileLoading"
        data-testpl="rx-flow-cancel-account-details-edit-btn"
        @click="
          $emit('cancelAccountDetailsEdit');
          accountDetailsEditMode = false;
        "
      >
        {{ $t('cancel') }}
      </BaseButton>
    </div>
  </div>

  <!-- Address View -->
  <div
    v-if="!addressEditMode"
    class="bg-site-bg rounded-8 flex flex-col gap-12 p-24"
    data-testpl="rx-flow-address-view"
  >
    <div class="flex items-center justify-between gap-12">
      <p>{{ $t('registeredAddress') }}</p>
      <BaseButton
        theme="link"
        class="!capitalize"
        @click="addressEditMode = true"
        data-testpl="rx-flow-address-edit-btn"
      >
        {{ $t('edit') }}
      </BaseButton>
    </div>
    <p class="text-12 text-secondary-text">
      {{ $t('makeSureYourAddressIsAssociatedWithAValidMedicalFacility') }}
    </p>

    <div class="mt-12 flex flex-col gap-8" data-testpl="rx-flow-address-section">
      <span class="text-10 text-secondary-text">{{ $t('address') }}</span>
      <ul class="flex flex-col gap-12">
        <li
          v-for="(addressLine, index) in formattedLivingAddress"
          :key="index"
          class="text-14 break-all"
        >
          {{ addressLine }}
        </li>
      </ul>
    </div>
  </div>

  <!-- Address Edit -->
  <div
    v-else
    class="bg-site-bg rounded-8 flex flex-col gap-24 p-24"
    data-testpl="rx-flow-address-edit-view"
  >
    <div class="flex flex-col gap-12">
      <p>{{ $t('registeredAddress') }}</p>
      <p class="text-12 text-secondary-text">
        {{ $t('makeSureYourAddressIsAssociatedWithAValidMedicalFacility') }}
      </p>
    </div>

    <div class="flex flex-col gap-16">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <BaseInput
          v-model="formData.livingAddress.city"
          :error="v$.livingAddress.city.$errors[0]?.$message"
          :placeholder="$t('city')"
          data-testpl="rx-flow-input-city"
        />
        <BaseSelect
          v-model="formData.livingAddress.state"
          :placeholder="$t('state')"
          :options="filteredOptions"
          by="code"
          :error="v$.livingAddress.state.$errors[0]?.$message"
          @update:open="handleSelectOpen"
        >
          <template #aboveContent>
            <div class="mt-12 px-16 pb-8">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('search')"
                class="rounded-4 border-ash text-14 w-full border px-12 py-8"
                data-testpl="rx-flow-input-search"
                @input.stop
                @keydown.stop
              />
            </div>
          </template>
        </BaseSelect>
      </div>

      <BaseInput
        ref="localLineInputRef"
        v-model="formData.livingAddress.line"
        class="w-full"
        :error="v$.livingAddress.line.$errors[0]?.$message"
        :placeholder="$t('streetAddress')"
        data-testpl="rx-flow-input-street-address"
      />

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <BaseInput
          v-model="formData.livingAddress.postalCode"
          v-maska="maskPostalCode"
          :error="v$.livingAddress.postalCode.$errors[0]?.$message"
          :placeholder="$t('zipCode')"
          data-testpl="rx-flow-input-postal-code"
        />
        <BaseInput v-model="formData.livingAddress.apt" :placeholder="$t('aptSuiteOptional')" />
      </div>

      <BaseInput
        :placeholder="$t('phoneNumber')"
        :model-value="formData.livingAddress.phone?.slice(2)"
        :error="v$.livingAddress.phone.$errors[0]?.$message"
        data-testpl="rx-flow-input-phone"
        v-maska="{
          ...maskPhone,
          onMaska: (detail) => (formData.livingAddress.phone = `+1${detail.unmasked}`),
        }"
      >
        <template #prepend>
          <span>🇺🇸 +1</span>
        </template>
      </BaseInput>
    </div>

    <div class="flex items-center gap-12">
      <BaseButton
        theme="solid"
        class="w-fit"
        data-testpl="rx-flow-save-address-btn"
        @click="onSaveAddressChanges"
      >
        {{ $t('saveChanges') }}
      </BaseButton>
      <BaseButton
        theme="outline"
        class="w-fit"
        data-testpl="rx-flow-cancel-address-edit-btn"
        @click="
          $emit('cancelAddressEdit');
          addressEditMode = false;
        "
      >
        {{ $t('cancel') }}
      </BaseButton>
    </div>
  </div>

  <!-- Identification -->
  <div class="bg-site-bg rounded-8 flex flex-col" data-testpl="rx-flow-identification-section">
    <div class="flex flex-col gap-12 p-24 pb-8">
      <p>{{ $t('identification') }}</p>
      <p class="text-12 text-secondary-text">
        {{ $t('pleaseEnsureYourNameAndPhotoMatchTheIDProvided') }}
      </p>
    </div>
    <BaseSpinner v-if="userStore.getProfileLoading" class="text-stone my-24 size-40 self-center" />
    <IdentificationBlock v-else ref="identificationBlockRef" type="completeDetails" />
  </div>
</template>
