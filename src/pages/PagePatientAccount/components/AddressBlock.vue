<script setup lang="ts">
import { useAddress } from '../composables/useAddress';
import type { AddressPayload } from '@/api/user/types';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect/BaseSelect.vue';
import {
  maskPhone,
  maskPostalCode,
  maskDoubleName,
  maskAddress,
} from '@/composables/useMaskOptions';
import { useStates } from '@/composables/useStates';
import { useUserUpdate } from '@/composables/useUserUpdate';
import { useUserStore } from '@/stores/user';
import { vMaska } from 'maska/vue';
import { computed, ref } from 'vue';

const userStore = useUserStore();
const { states } = useStates();
const { updateAddress, updateAddressLoading } = useUserUpdate();
const { formData, v$ } = useAddress();

const editMode = ref('');
const searchQuery = ref('');

const onSubmit = async () => {
  if (!(await v$.value.$validate())) {
    return;
  }

  const type = editMode.value === 'shippingAddress' ? 'shipping' : 'billing';

  const payload: AddressPayload = {
    addressLine1: formData.line1 || '',
    addressLine3: formData.apt || '',
    fields: {
      addressFirstName: formData.addressFirstName,
      addressLastName: formData.addressLastName,
      addressType: type,
      phone: formData.phone,
    },
    administrativeArea: formData.state_code,
    locality: formData.city || '',
    postalCode: formData.zip || '',
    title: type,
  };
  if (await updateAddress(payload, type)) {
    editMode.value = '';
  }
};

const handleCancelEditMode = () => {
  editMode.value = '';
  Object.keys(formData).forEach((key) => {
    formData[key as keyof typeof formData] = '';
  });
};

const handleEditMode = (type: 'shippingAddress' | 'billingAddress') => {
  editMode.value = type;
  formData.city = userStore.profile?.user.addresses[type]?.locality ?? '';
  formData.state_code =
    (states.value?.find(
      (item) => item.code === userStore.profile?.user.addresses[type]?.administrativeArea,
    )?.code as string) || '';
  formData.addressFirstName = userStore.profile?.user.addresses[type]?.addressFirstName ?? '';
  formData.addressLastName = userStore.profile?.user.addresses[type]?.addressLastName ?? '';
  formData.line1 = userStore.profile?.user.addresses[type]?.addressLine1 ?? '';
  formData.zip = userStore.profile?.user.addresses[type]?.postalCode ?? '';
  formData.apt = userStore.profile?.user.addresses[type]?.addressLine3 ?? '';
  formData.phone = userStore.profile?.user.addresses[type]?.phone ?? '';
};

const isAddress = (address: unknown[]) => {
  return address.length > 1;
};

const filteredOptions = computed(() => {
  if (!searchQuery.value) return states.value;

  const query = searchQuery.value.toLowerCase();
  return states.value?.filter(
    (option) => option.label?.toLowerCase().includes(query) || option.code === formData.state_code,
  );
});

const handleSelectOpen = (isOpen: boolean) => {
  if (!isOpen) {
    searchQuery.value = '';
  }
};

const line1InputComponent = ref<typeof BaseInput | null>(null);

defineExpose({
  line1InputComponent,
});
</script>

<template>
  <section data-testpl="account-address" class="rounded-8 flex flex-col gap-24 bg-white p-24">
    <p>{{ $t('address') }}</p>

    <div v-show="!editMode" class="flex flex-col gap-24 lg:flex-row">
      <div data-testpl="account-address-shipping" class="flex w-full items-start gap-24">
        <div class="flex w-full flex-col gap-24">
          <div class="flex items-center justify-between gap-24">
            <p class="text-10 text-beige font-medium uppercase">{{ $t('shippingAddress') }}</p>
            <BaseButton theme="link" class="!capitalize" @click="handleEditMode('shippingAddress')">
              {{ $t('edit') }}
            </BaseButton>
          </div>

          <ul v-if="isAddress(userStore.formattedShippingAddress)" class="flex flex-col gap-12">
            <li
              v-for="(addressLine, index) in userStore.formattedShippingAddress"
              :key="index"
              class="text-14 break-all"
            >
              {{ addressLine }}
            </li>
          </ul>
          <span v-else class="text-14">{{ $t('notSpecified') }}</span>
        </div>
      </div>
      <div data-testpl="account-address-billing" class="flex w-full items-start gap-24">
        <div class="flex w-full flex-col gap-24">
          <div class="flex items-center justify-between gap-24">
            <p class="text-10 text-beige font-medium uppercase">{{ $t('billingAddress') }}</p>
            <BaseButton theme="link" class="!capitalize" @click="handleEditMode('billingAddress')">
              {{ $t('edit') }}
            </BaseButton>
          </div>

          <ul v-if="isAddress(userStore.formattedBillingAddress)" class="flex flex-col gap-12">
            <li
              v-for="(addressLine, index) in userStore.formattedBillingAddress"
              :key="index"
              class="text-14 break-all"
            >
              {{ addressLine }}
            </li>
          </ul>
          <span v-else class="text-14">{{ $t('notSpecified') }}</span>
        </div>
      </div>
    </div>

    <div v-show="editMode" class="flex flex-col gap-24">
      <p class="text-10 text-beige font-medium uppercase">
        {{ editMode === 'shippingAddress' ? $t('shippingAddress') : $t('billingAddress') }}
      </p>

      <div class="flex flex-col gap-16">
        <div class="flex flex-col gap-16 lg:flex-row">
          <BaseInput
            v-model.trim="formData.addressFirstName"
            v-maska="maskDoubleName"
            class="w-full"
            :error="v$.addressFirstName.$errors[0]?.$message"
            :placeholder="$t('firstName')"
          />
          <BaseInput
            v-model.trim="formData.addressLastName"
            v-maska="maskDoubleName"
            class="w-full"
            :error="v$.addressLastName.$errors[0]?.$message"
            :placeholder="$t('lastName')"
          />
        </div>
        <div class="flex flex-col gap-16 lg:flex-row">
          <BaseInput
            v-model.trim="formData.city"
            v-maska="maskAddress"
            class="w-full"
            :error="v$.city.$errors[0]?.$message"
            :placeholder="$t('city')"
          />
          <div class="w-full">
            <BaseSelect
              v-model.trim="formData.state_code"
              :placeholder="$t('state')"
              :error="v$.state_code.$errors[0]?.$message"
              :options="filteredOptions"
              by="code"
              data-testpl="select-state-btn"
              @update:open="handleSelectOpen"
            >
              <template #aboveContent>
                <div class="mt-12 px-16 pb-8">
                  <input
                    v-model="searchQuery"
                    type="text"
                    :placeholder="$t('search')"
                    class="rounded-4 border-ash text-14 w-full border px-12 py-8"
                    @input.stop
                    @keydown.stop
                  />
                </div>
              </template>
            </BaseSelect>
          </div>
        </div>

        <BaseInput
          ref="line1InputComponent"
          v-model.trim="formData.line1"
          v-maska="maskAddress"
          :error="v$.line1.$errors[0]?.$message"
          class="w-full"
          :placeholder="$t('streetAddress')"
        />

        <div class="flex flex-col gap-16 lg:flex-row">
          <BaseInput
            v-model.trim="formData.zip"
            class="w-full"
            v-maska="maskPostalCode"
            :error="v$.zip.$errors[0]?.$message"
            :placeholder="$t('zipCode')"
          />
          <BaseInput v-model="formData.apt" class="w-full" :placeholder="$t('aptSuiteOptional')" />
        </div>

        <BaseInput
          :placeholder="$t('phoneNumber')"
          :model-value="formData.phone.slice(2)"
          v-maska="{
            ...maskPhone,
            onMaska: (detail) => (formData.phone = `+1${detail.unmasked}`),
          }"
          :error="v$.phone.$errors[0]?.$message"
          type="tel"
          name="phone"
        >
          <template #prepend>
            <span>🇺🇸 +1</span>
          </template>
        </BaseInput>
      </div>

      <div class="flex flex-col gap-12 lg:flex-row">
        <BaseButton
          theme="outline"
          :disabled="updateAddressLoading"
          size="37"
          @click="handleCancelEditMode"
          class="lg:order-1"
        >
          {{ $t('cancel') }}
        </BaseButton>
        <BaseButton size="37" :loading="updateAddressLoading" @click="onSubmit">
          {{ $t('saveChanges') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>
