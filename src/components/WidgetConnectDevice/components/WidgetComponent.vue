<script lang="ts" setup>
import type { TerraEndUser } from '@/api/integrations/terra/types.ts';
import IconDevice from '@/assets/icons/device.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import ModalConnectDevices from '@/components/ModalConnectDevices/ModalConnectDevices.vue';
import { useConnectDevice } from '@/composables/useConnectDevice';

const props = defineProps<{
  terra: TerraEndUser | null | undefined;
}>();

const { isLoading, connectUrl, disconnectDevice, modalConnectDevicesShow, devices } =
  useConnectDevice(props.terra);
</script>

<template>
  <div
    class="rounded-8 flex flex-col gap-24 bg-white p-16 lg:gap-32 lg:p-24"
    data-testpl="dashboard-device"
  >
    <div class="flex flex-col gap-16">
      <h2 class="text-21 lg:text-26 font-secondary">{{ $t('connectYourDevice') }}</h2>

      <span class="text-14 text-secondary-text" data-testpl="card-header">
        {{ $t('youCanConnectAWearableOrHealthTracker') }}
      </span>
    </div>

    <figure class="border-stone mx-auto size-96 rounded-full border p-28">
      <IconDevice class="size-40" />
    </figure>

    <BaseButton
      @click="modalConnectDevicesShow = true"
      :loading="isLoading"
      data-testpl="card-button"
    >
      {{ $t('seeSupportedDevices').toUpperCase() }}
    </BaseButton>

    <ModalConnectDevices
      v-model="modalConnectDevicesShow"
      :devices
      :loading="isLoading"
      @connect="connectUrl"
      @disconnect="disconnectDevice"
    />
  </div>
</template>
