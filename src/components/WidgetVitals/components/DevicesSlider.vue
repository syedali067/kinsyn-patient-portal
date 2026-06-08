<script setup lang="ts">
import CardSlider from '@/components/CardSlider/CardSlider.vue';
import CardSliderSlide from '@/components/CardSlider/CardSliderSlide.vue';
import DeviceSettings from '@/components/TerraWidget/components/DeviceSettings.vue';
import type { TerraWidgetData } from '@/components/TerraWidget/types';

defineProps<{
  endUsers: TerraWidgetData[];
}>();

const isOpen = defineModel({ default: false });
</script>

<template>
  <CardSlider v-if="isOpen" data-testpl="device-settings-slider">
    <CardSliderSlide v-for="endUser in endUsers" :key="endUser.terraUserId" with-bottom-spacing>
      <DeviceSettings
        :provider="endUser.deviceName"
        :terra-user-id="endUser.terraUserId"
        :last-sync="endUser.lastSync"
        class="size-full"
        hide-header
        @cancel="isOpen = false"
      />
    </CardSliderSlide>
  </CardSlider>
</template>
