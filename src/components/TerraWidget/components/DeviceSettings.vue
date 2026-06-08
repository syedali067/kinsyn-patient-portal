<script setup lang="ts">
import { useTerraWidget } from '../composables/useTerraWidget';
import { apiTerra } from '@/api/integrations/terra';
import type {
  TerraUser,
  TerraUserTerraInfo,
  TerraUserTerraInfoProvider,
} from '@/api/integrations/terra/types';
import IconFilters from '@/assets/icons/filters.svg?component';
import appleDeviceImage from '@/assets/images/devices/apple.jpg';
import fitbitDeviceImage from '@/assets/images/devices/fitbit.jpg';
import garminDeviceImage from '@/assets/images/devices/garmin.png';
import ouraDeviceImage from '@/assets/images/devices/oura.png';
import samsungDeviceImage from '@/assets/images/devices/samsung.jpg';
import whoopDeviceImage from '@/assets/images/devices/whoop.jpg';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { stringToSecondaryReadableDateFormat } from '@/utils/formatters';
import { computed } from 'vue';

const props = defineProps<{
  terraUserId: TerraUserTerraInfo['user_id'];
  provider: TerraUserTerraInfoProvider;
  lastSync: TerraUser['lastEvent'];
  hideHeader?: boolean;
}>();

const emit = defineEmits<{
  disconnected: [];
  cancel: [];
}>();

const open = defineModel<boolean>({ default: false });

const { getDeviceName, disconnectUser, syncUser, syncUserLoading, disconnectUserLoading } =
  useTerraWidget();

const images: Record<TerraUserTerraInfoProvider, string> = {
  APPLE: appleDeviceImage,
  FITBIT: fitbitDeviceImage,
  GARMIN: garminDeviceImage,
  OURA: ouraDeviceImage,
  SAMSUNG: samsungDeviceImage,
  WHOOP: whoopDeviceImage,
};

const providerName = computed(() => getDeviceName(props.provider));
const providerImage = computed(() => images[props.provider]);

const disconnect = async () => {
  await disconnectUser(props.terraUserId);

  // Update TerraDevices request cache
  await apiTerra.getTerraEndUser.load();

  open.value = false;

  emit('disconnected');
};

const onCancel = () => {
  open.value = false;
  emit('cancel');
};
</script>

<template>
  <div class="flex flex-col gap-24 bg-white p-24" data-testpl="device-settings">
    <div
      v-if="!hideHeader"
      class="flex items-center justify-between"
      data-testpl="device-settings-header"
    >
      <h4 class="text-26 font-secondary" data-testpl="device-settings-title">
        {{ $t('deviceSettings') }}
      </h4>

      <BaseButton
        color="dark"
        size="37"
        theme="solid"
        rounded
        @click="open = false"
        data-testpl="device-settings-close-button"
      >
        {{ providerName }}

        <template #append>
          <IconFilters class="size-20" />
        </template>
      </BaseButton>
    </div>

    <div class="flex grow flex-col items-center justify-center gap-16">
      <picture class="size-96 overflow-hidden" data-testpl="device-settings-image">
        <img :src="providerImage" class="size-full object-contain" draggable="false" />
      </picture>

      <span class="text-14 -mb-8 font-medium uppercase" data-testpl="device-settings-name">
        {{ providerName }}
      </span>

      <div class="text-center">
        <div class="text-14 text-secondary-text" data-testpl="device-settings-status-text">
          <span v-if="syncUserLoading"> {{ $t('loading') }}... </span>

          <span v-else>
            {{ $t('deviceIsConnected') }}
          </span>
        </div>

        <div
          v-if="lastSync"
          class="text-14 text-secondary-text"
          data-testpl="device-settings-last-sync-text"
        >
          {{ $t('lastSync') }}: {{ stringToSecondaryReadableDateFormat(lastSync, true) }}
        </div>
      </div>

      <BaseButton
        class="mt-24 w-full"
        theme="outline"
        :loading="syncUserLoading"
        data-testpl="device-settings-sync-button"
        @click="syncUser(terraUserId)"
      >
        {{ $t('syncManually') }}
      </BaseButton>

      <BaseButton
        class="w-full"
        theme="outline"
        :loading="disconnectUserLoading"
        data-testpl="device-settings-disconnect-button"
        @click="disconnect"
      >
        {{ $t('disconnectDevice') }}
      </BaseButton>

      <BaseButton
        class="w-full"
        theme="link"
        @click="onCancel"
        data-testpl="device-settings-cancel-button"
      >
        {{ $t('cancel') }}
      </BaseButton>
    </div>
  </div>
</template>
