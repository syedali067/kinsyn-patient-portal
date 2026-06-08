import { apiTerra } from '@/api/integrations/terra';
import type { TerraEndUser } from '@/api/integrations/terra/types.ts';
import IconApple from '@/assets/icons/apple.svg?component';
import IconFitbit from '@/assets/images/fitbit.svg?component';
import IconGarmin from '@/assets/images/garmin.svg?component';
import IconOura from '@/assets/images/oura.svg?component';
import IconWhoop from '@/assets/images/whoop.svg?component';
import { useToastStore } from '@/stores/toast';
import type { TerraDevice } from '@/types/integration.ts';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Global state for modal visibility
const modalConnectDevicesShow = ref(false);

export const openConnectDeviceModal = () => {
  modalConnectDevicesShow.value = true;
};

export function useConnectDevice(terra: TerraEndUser | null | undefined) {
  const toastStore = useToastStore();
  const { t } = useI18n();

  const isLoading = ref(false);

  const terraUsers = computed(() => {
    return terra?.terraUsers || [];
  });

  const devices = ref<TerraDevice[]>([
    {
      name: 'Apple Health',
      slug: 'APPLE',
      icon: IconApple,
      isConnected: !!terraUsers.value.find((user) => user.terra.provider === 'APPLE'),
      loading: false,
    },
    {
      name: 'Fitbit',
      slug: 'FITBIT',
      icon: IconFitbit,
      isConnected: !!terraUsers.value.find((user) => user.terra.provider === 'FITBIT'),
      loading: false,
    },
    {
      name: 'Garmin',
      slug: 'GARMIN',
      icon: IconGarmin,
      isConnected: !!terraUsers.value.find((user) => user.terra.provider === 'GARMIN'),
      loading: false,
    },
    {
      name: 'Whoop',
      slug: 'WHOOP',
      icon: IconWhoop,
      isConnected: !!terraUsers.value.find((user) => user.terra.provider === 'WHOOP'),
      loading: false,
    },
    {
      name: 'Oura',
      slug: 'OURA',
      icon: IconOura,
      isConnected: !!terraUsers.value.find((user) => user.terra.provider === 'OURA'),
      loading: false,
    },
  ]);

  const connectUrl = async (device: TerraDevice) => {
    try {
      device.loading = true;
      const response = await apiTerra.connectUrl(device.slug);

      if (response.statusCode.value !== 200) {
        device.loading = false;
        return;
      }

      const url = response.data.value?.data?.url;
      if (url) {
        window.location.href = url;
      }
    } finally {
      device.loading = false;
      modalConnectDevicesShow.value = false;
    }
  };

  const disconnectDevice = async (device: TerraDevice) => {
    const terraUser = terraUsers.value?.find((user) => user.terra.provider === device.slug);
    if (!terraUser?.terra.user_id) return;
    try {
      device.loading = true;

      const response = await apiTerra.disconnectUser(terraUser.terra.user_id as string);

      if (response.statusCode.value !== 200) {
        return;
      }

      device.isConnected = false;
      toastStore.addToast({
        type: 'success',
        text: t('deviceWasDisconnected'),
      });
      await apiTerra.getTerraEndUser();
    } finally {
      device.loading = false;
    }
  };

  return {
    isLoading,
    connectUrl,
    modalConnectDevicesShow,
    devices,
    disconnectDevice,
  };
}
