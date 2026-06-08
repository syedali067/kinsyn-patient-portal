<script setup lang="ts">
import IconMonitor from '@/assets/icons/monitor.svg?component';
import IconPrivacy from '@/assets/icons/privacy.svg?component';
import IconSecurity from '@/assets/icons/security.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import { TRYTERRA_PRIVACY_POLICY_URL } from '@/constants/links';
import type { TerraDevice } from '@/types/integration.ts';
import { ref, watch } from 'vue';

const isOpen = defineModel<boolean>({ default: false });

defineProps<{
  loading: boolean;
  devices: TerraDevice[];
}>();

const emit = defineEmits<{
  connect: [value: TerraDevice];
  disconnect: [value: TerraDevice];
}>();

const firstStep = ref(true);

const handleConnect = async (device: TerraDevice) => {
  if (device.isConnected) {
    emit('disconnect', device);
  } else {
    emit('connect', device);
  }
};

watch(
  () => isOpen.value,
  () => {
    firstStep.value = true;
  },
);
</script>

<template>
  <BaseDialog v-model:open="isOpen" class="h-full min-h-650 max-w-502 lg:h-auto">
    <template #header>
      <p v-if="!firstStep" class="text-21 lg:text-26 font-secondary m-16">
        {{ $t('selectAWearable') }}
      </p>
    </template>
    <template #content>
      <div v-if="firstStep" class="flex flex-col gap-24 lg:gap-32">
        <p class="text-21 lg:text-26 font-secondary text-center">
          {{ $t('kinsynUsesTerraToConnectYourWearable') }}
        </p>
        <div
          class="bg-site-bg rounded-8 flex flex-col gap-16 p-16 lg:mx-16 lg:gap-24 lg:px-24 lg:py-32"
        >
          <div class="flex items-center gap-16">
            <figure class="bg-bone rounded-4 flex size-64 shrink-0 items-center justify-center">
              <IconPrivacy class="size-32" />
            </figure>
            <div class="flex flex-col gap-4">
              <p>{{ $t('trustedService') }}</p>
              <p class="text-14 text-secondary-text">
                {{ $t('yourInformationIsHandledAnonymously') }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-16">
            <figure class="bg-bone rounded-4 flex size-64 shrink-0 items-center justify-center">
              <IconSecurity class="size-32" />
            </figure>
            <div class="flex flex-col gap-4">
              <p>{{ $t('privacyFirst') }}</p>
              <p class="text-14 text-secondary-text">
                {{ $t('youCanReviewAListOfPermissions') }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-16">
            <figure class="bg-bone rounded-4 flex size-64 shrink-0 items-center justify-center">
              <IconMonitor class="size-32" />
            </figure>
            <div class="flex flex-col gap-4">
              <p>{{ $t('healthMetrics') }}</p>
              <p class="text-14 text-secondary-text">
                {{ $t('youAreProvidingKinsynAccessToHealthMetrics') }}
              </p>
            </div>
          </div>
          <BaseButton class="mt-16" @click="firstStep = false">{{ $t('continue') }}</BaseButton>
        </div>
      </div>
      <div v-else class="flex flex-col gap-6 lg:mx-16">
        <div
          v-for="device in devices"
          :key="device.slug"
          class="flex items-center justify-between gap-16 py-16 lg:p-16"
        >
          <div class="flex items-center gap-16">
            <figure class="bg-bone rounded-4 flex size-48 shrink-0 items-center justify-center">
              <component :is="device.icon" />
            </figure>
            <span class="text-18">{{ device.name }}</span>
          </div>
          <BaseButton
            theme="outline"
            :loading="device.loading"
            class="shrink-0"
            @click="handleConnect(device)"
          >
            {{ device.isConnected ? $t('disconnect') : $t('connect') }}
          </BaseButton>
        </div>
      </div>
    </template>

    <template #footer>
      <p
        v-if="firstStep"
        class="text-14 text-secondary-text mx-16 text-center tracking-[-0.14px] lg:whitespace-nowrap"
      >
        {{ $t('byClickingContinueYouAgreeToTerras') }}
        <a class="underline" :href="TRYTERRA_PRIVACY_POLICY_URL" target="_blank">
          {{ $t('endUserPrivacyPolicy') }}
        </a>
      </p>
    </template>
  </BaseDialog>
</template>
