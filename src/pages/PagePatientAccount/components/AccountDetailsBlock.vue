<script setup lang="ts">
import ModalUploadAvatar from '../components/ModalUploadAvatar.vue';
import BaseAvatar from '@/components/BaseAvatar/BaseAvatar.vue';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect/BaseSelect.vue';
import { maskDay, maskDoubleName, maskYear } from '@/composables/useMaskOptions';
import { useStaticData } from '@/composables/useStaticData';
import { useUserUpdate } from '@/composables/useUserUpdate.ts';
import { useValidator } from '@/composables/useValidator.ts';
import { useDetails } from '@/pages/PagePatientAccount/composables/useDetails.ts';
import { useUserStore } from '@/stores/user';
import type { ProfileUser } from '@/types/user';
import { useVuelidate } from '@vuelidate/core';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { vMaska } from 'maska/vue';
import { computed, reactive, ref } from 'vue';
import type { CropperResult } from 'vue-advanced-cropper';

const { genderOptions, months } = useStaticData();
const userStore = useUserStore();
const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');
const { emailRules, dateValidation, firstNameRules, lastNameRules, genderRules } = useValidator();
const { updateProfile, updateProfileLoading } = useUserUpdate();
const { uploadPhoto, uploadPhotoLoading } = useDetails();

const isEditMode = ref(false);
const isModalUploadAvatarVisible = ref(false);

const formData = reactive<{
  firstName: string;
  lastName: string;
  email: string;
  day: string;
  month: string;
  year: string;
  gender: ProfileUser['gender'];
}>({
  firstName: userStore.profile?.user.firstName ?? '',
  lastName: userStore.profile?.user.lastName ?? '',
  email: userStore.profile?.user.email ?? '',
  day: userStore.profile?.user.dob?.toString().substring(6, 8) ?? '',
  month: userStore.profile?.user.dob?.toString().substring(4, 6) ?? '',
  year: userStore.profile?.user.dob?.toString().substring(0, 4) ?? '',
  gender: userStore.profile?.user.gender ?? null,
});

const rules = computed(() => {
  return {
    firstName: firstNameRules,
    lastName: lastNameRules,
    email: emailRules,
    gender: genderRules,
    ...dateValidation(
      {
        day: formData.day,
        month: formData.month,
        year: formData.year,
      },
      'dob',
    ),
  };
});

const v$ = useVuelidate(rules, formData, { $scope: false });

const handleClickUpload = (value: CropperResult) => {
  if (value?.canvas) {
    value.canvas.toBlob(async (blob: Blob | null) => {
      if (blob) {
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        const response = await uploadPhoto(file);
        if (response) isModalUploadAvatarVisible.value = false;
      }
    }, 'image/jpeg');
  }
};
const onSubmit = async () => {
  if (!(await v$.value.$validate())) {
    return;
  }
  const payload = {
    user: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      dob: `${formData.year}${formData.month}${formData.day}`,
      gender: formData.gender,
    },
  };
  userStore.profile = await updateProfile(userStore.userId as number, payload);
  handleCancelEditMode();
};

const handleCancelEditMode = () => {
  isEditMode.value = false;
  formData.firstName = userStore.profile?.user.firstName ?? '';
  formData.lastName = userStore.profile?.user.lastName ?? '';
  formData.email = userStore.profile?.user.email ?? '';
  formData.day = userStore.profile?.user.dob?.toString().substring(6, 8) ?? '';
  formData.month = userStore.profile?.user.dob?.toString().substring(4, 6) ?? '';
  formData.year = userStore.profile?.user.dob?.toString().substring(0, 4) ?? '';
  formData.gender = userStore.profile?.user.gender ?? null;
};
</script>

<template>
  <ModalUploadAvatar
    v-model="isModalUploadAvatarVisible"
    :loading="uploadPhotoLoading"
    @submit="handleClickUpload"
  />

  <section
    data-testpl="account-details"
    class="rounded-8 flex flex-row justify-between bg-white p-24"
  >
    <div class="flex w-full flex-col gap-24">
      <div class="flex items-center justify-between gap-24">
        <p>{{ $t('accountDetails') }}</p>

        <template v-if="greaterOrEqualLg">
          <BaseButton v-if="isEditMode" theme="outline" size="37" @click="handleCancelEditMode">
            {{ $t('cancel') }}
          </BaseButton>

          <BaseButton
            v-if="!isEditMode"
            data-testpl="account-details-edit-btn"
            theme="outline"
            size="37"
            @click="isEditMode = true"
          >
            {{ $t('edit') }}
          </BaseButton>
        </template>
      </div>

      <div class="flex items-center justify-between gap-16">
        <BaseAvatar
          data-testpl="account-details-image"
          :src="userStore.profile?.avatar"
          :name="userStore.fullName"
          size="64"
        />

        <BaseButton
          v-if="isEditMode"
          theme="link"
          class="!normal-case"
          @click="isModalUploadAvatarVisible = true"
        >
          {{ $t('changeProfilePicture') }}
        </BaseButton>
      </div>

      <template v-if="!isEditMode">
        <div data-testpl="account-details-name" class="flex flex-col gap-8">
          <p class="text-10 text-secondary-text">
            {{ $t('id') }}
          </p>
          <p class="text-14">#{{ userStore.userId }}</p>
        </div>
        <div data-testpl="account-details-name" class="flex flex-col gap-8">
          <p class="text-10 text-secondary-text">
            {{ $t('name') }}
          </p>
          <p class="text-14">
            {{ userStore.fullName }}
          </p>
        </div>

        <div data-testpl="account-details-email" class="flex flex-col gap-8">
          <p class="text-10 text-secondary-text">
            {{ $t('emailAddress') }}
          </p>
          <p class="text-14 break-all">
            {{ userStore.email ?? $t('notSpecified') }}
          </p>
        </div>

        <div data-testpl="account-details-date-of-birth" class="flex flex-col gap-8">
          <p class="text-10 text-secondary-text">
            {{ $t('dateOfBirth') }}
          </p>
          <p v-if="userStore.profile?.user.dob" class="text-14">
            {{ formData.month }}/{{ formData.day }}/{{ formData.year }}
          </p>
          <p v-else class="text-14">{{ $t('notSpecified') }}</p>
        </div>

        <div data-testpl="account-details-biological-sex" class="flex flex-col gap-8">
          <p class="text-10 text-secondary-text">
            {{ $t('biologicalSex') }}
          </p>
          <p v-if="userStore.profile?.user.gender" class="text-14">
            {{ userStore.profile?.user.gender === 'M' ? $t('male') : $t('female') }}
          </p>
          <p v-else class="text-14">{{ $t('notSpecified') }}</p>
        </div>
      </template>

      <template v-else>
        <div class="flex flex-col gap-16">
          <div class="flex flex-col gap-16 lg:flex-row">
            <BaseInput
              v-model.trim="formData.firstName"
              v-maska="maskDoubleName"
              :error="v$.firstName.$errors[0]?.$message"
              :placeholder="$t('firstName')"
              disabled
              class="w-full"
              data-testpl="account-details-form-first-name"
            />
            <BaseInput
              v-model.trim="formData.lastName"
              v-maska="maskDoubleName"
              :error="v$.lastName.$errors[0]?.$message"
              :placeholder="$t('lastName')"
              disabled
              class="w-full"
              data-testpl="account-details-form-last-name"
            />
          </div>

          <BaseInput
            v-model.trim="formData.email"
            :placeholder="$t('emailAddress')"
            :error="v$.email.$errors[0]?.$message"
            class="w-full"
            data-testpl="account-details-form-email"
          />

          <div class="flex flex-col gap-12">
            <p class="text-14">{{ $t('selectBirthDate') }}</p>
            <div class="flex flex-col gap-16 lg:flex-row">
              <BaseSelect
                v-model.trim="formData.month"
                :placeholder="$t('month')"
                :options="months"
                :error="v$.month.$errors[0]?.$message"
                data-testpl="account-details-form-month"
              />
              <BaseInput
                v-model.trim="formData.day"
                v-maska="maskDay"
                :placeholder="$t('day')"
                :error="v$.day.$errors[0]?.$message"
                class="w-full"
                data-testpl="account-details-form-day"
              />
              <BaseInput
                v-model.trim="formData.year"
                v-maska="maskYear"
                :placeholder="$t('year')"
                :error="v$.year.$errors[0]?.$message"
                class="w-full"
                data-testpl="account-details-form-year"
              />
            </div>
          </div>

          <BaseSelect
            :model-value="formData.gender ?? ''"
            :error="v$.gender.$errors[0]?.$message"
            :placeholder="$t('biologicalSex')"
            :options="genderOptions"
            data-testpl="account-details-form-gender"
            @update:model-value="
              (val: string | number) => (formData.gender = val as ProfileUser['gender'])
            "
          />
        </div>
      </template>

      <div class="flex flex-col gap-12">
        <BaseButton
          v-if="!isEditMode && !greaterOrEqualLg"
          data-testpl="account-details-edit-btn"
          theme="outline"
          size="37"
          @click="isEditMode = true"
        >
          {{ $t('edit') }}
        </BaseButton>

        <template v-else>
          <BaseButton
            v-if="isEditMode && !greaterOrEqualLg"
            theme="outline"
            size="37"
            :disabled="updateProfileLoading"
            @click="handleCancelEditMode"
          >
            {{ $t('cancel') }}
          </BaseButton>
        </template>
        <BaseButton
          v-if="isEditMode"
          size="37"
          :loading="updateProfileLoading"
          class="w-full lg:w-fit"
          @click="onSubmit"
        >
          {{ $t('saveChanges') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>
