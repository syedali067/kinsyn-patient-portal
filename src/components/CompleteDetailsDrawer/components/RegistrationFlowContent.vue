<script setup lang="ts">
import type { FormData } from '../types';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect/BaseSelect.vue';
import { maskDay, maskPhone, maskPostalCode, maskYear } from '@/composables/useMaskOptions';
import { useStates } from '@/composables/useStates';
import { useStaticData } from '@/composables/useStaticData';
import IdentificationBlock from '@/pages/PagePatientAccount/components/IdentificationBlock.vue';
import { useUserStore } from '@/stores/user';
import type { Validation } from '@vuelidate/core';
import { vMaska } from 'maska/vue';
import { computed, ref } from 'vue';

const formData = defineModel<FormData>('formData', { required: true });

defineProps<{
  v$: Validation;
  genderOptions: { value: string; label: string }[];
}>();

const userStore = useUserStore();
const { months } = useStaticData();
const { states } = useStates();
const searchQuery = ref('');
const identificationBlockRef = ref<InstanceType<typeof IdentificationBlock> | null>(null);
const lineInputRef = ref<InstanceType<typeof BaseInput> | null>(null);

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

const handleSelectOpen = (isOpen: boolean) => {
  if (!isOpen) {
    searchQuery.value = '';
  }
};

defineExpose({
  identificationBlockRef,
  lineInputRef,
  isIdentificationLoading,
});
</script>

<template>
  <p
    class="text-21 lg:text-26 font-secondary break-words lg:max-w-400"
    data-testpl="registration-flow-description"
  >
    <span class="text-beige" data-testpl="registration-flow-first-name">
      {{ userStore.profile?.user.firstName }},
    </span>
    <span class="lowercase">
      {{ $t('toDisplayYourHealthDataWeNeedToVerifyYourInformation') }}
    </span>
  </p>

  <div class="flex flex-col gap-12" data-testpl="registration-flow-birth-date-section">
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
        data-testpl="registration-flow-select-month"
      />
      <div class="flex flex-row gap-16">
        <BaseInput
          v-model.trim="formData.day"
          v-maska="maskDay"
          :placeholder="$t('day')"
          data-testpl="registration-flow-input-day"
          :error="v$.day?.$errors[0]?.$message"
          class="w-full"
        />
        <BaseInput
          v-model.trim="formData.year"
          v-maska="maskYear"
          :placeholder="$t('year')"
          data-testpl="registration-flow-input-year"
          :error="v$.year?.$errors[0]?.$message"
          class="w-full"
        />
      </div>
    </div>
  </div>

  <div class="flex flex-col gap-12" data-testpl="registration-flow-biological-sex-section">
    <p>{{ $t('biologicalSex') }}</p>
    <p class="text-12 text-secondary-text">
      {{ $t('toEnsureAccurateLabResultsAndMedicalGuidance') }}
    </p>
    <BaseSelect
      v-model="formData.gender"
      :placeholder="$t('biologicalSex')"
      :options="genderOptions"
      :error="v$.gender.$errors[0]?.$message"
      data-testpl="registration-flow-select-biological-sex"
    />
  </div>

  <div class="flex flex-col gap-12" data-testpl="registration-flow-registered-address-section">
    <p>{{ $t('registeredAddress') }}</p>
    <p class="text-12 text-secondary-text">
      {{ $t('theRegisteredAddressMustHaveBeenUsedAtAValidMedicalFacility') }}
    </p>

    <div class="flex flex-col gap-16">
      <div class="w-full">
        <BaseSelect
          v-model="formData.livingAddress.state"
          :placeholder="$t('state')"
          :options="filteredOptions"
          by="code"
          :error="v$.livingAddress.state.$errors[0]?.$message"
          data-testpl="registration-flow-select-state"
          @update:open="handleSelectOpen"
        >
          <template #aboveContent>
            <div class="mt-12 px-16 pb-8">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('search')"
                class="rounded-4 border-ash text-14 w-full border px-12 py-8"
                data-testpl="registration-flow-input-search"
                @input.stop
                @keydown.stop
              />
            </div>
          </template>
        </BaseSelect>
      </div>

      <BaseInput
        v-model.trim="formData.livingAddress.city"
        class="w-full"
        :error="v$.livingAddress.city.$errors[0]?.$message"
        :placeholder="$t('city')"
        data-testpl="registration-flow-input-city"
      />

      <BaseInput
        ref="lineInputRef"
        v-model.trim="formData.livingAddress.line"
        class="w-full"
        :error="v$.livingAddress.line.$errors[0]?.$message"
        :placeholder="$t('streetAndHouseNumber')"
        data-testpl="registration-flow-input-line"
      />

      <BaseInput
        v-model.trim="formData.livingAddress.apt"
        class="w-full"
        :placeholder="$t('apartmentUnitSuiteOrFloorOptional')"
        data-testpl="registration-flow-input-apt"
      />

      <BaseInput
        v-model.trim="formData.livingAddress.postalCode"
        class="w-full"
        v-maska="maskPostalCode"
        :error="v$.livingAddress.postalCode.$errors[0]?.$message"
        :placeholder="$t('postalCode')"
        data-testpl="registration-flow-input-postal-code"
      />

      <BaseInput
        :placeholder="$t('phoneNumber')"
        :model-value="formData.livingAddress.phone?.slice(2)"
        :error="v$.livingAddress.phone.$errors[0]?.$message"
        data-testpl="registration-flow-input-phone"
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
  </div>

  <div class="mb-8 flex w-full flex-col gap-16 lg:max-w-530">
    <p class="text-26 font-secondary break-words" data-testpl="registration-flow-description">
      {{ $t('asAFinalStepPleaseVerifyYourIdentity') }}
    </p>
    <p class="text-14">
      {{ $t('weNeedACopyOfYourDriversLicenseOrPassport') }}
    </p>
  </div>

  <div class="bg-site-bg rounded-8 flex flex-col gap-24 p-24">
    <div class="flex flex-col gap-12">
      <p>{{ $t('legalName') }}</p>
      <p class="text-14 text-secondary-text">
        {{ $t('pleaseEnsureYourNameMatchesTheIDProvided') }}
      </p>
    </div>
    <div class="flex items-center gap-16">
      <BaseInput
        :model-value="userStore.profile?.user.firstName ?? ''"
        class="w-full"
        disabled
        :placeholder="$t('firstName')"
        data-testpl="registration-flow-input-first-name"
      />
      <BaseInput
        :model-value="userStore.profile?.user.lastName ?? ''"
        class="w-full"
        disabled
        :placeholder="$t('lastName')"
        data-testpl="registration-flow-input-last-name"
      />
    </div>
  </div>

  <div class="bg-site-bg rounded-8">
    <IdentificationBlock ref="identificationBlockRef" type="completeDetails" />
  </div>
</template>
