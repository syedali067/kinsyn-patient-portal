<script setup lang="ts">
import SkeletonComponent from './components/SkeletonComponent.vue';
import TerraWidget from '@/components/TerraWidget/TerraWidget.vue';
import { useTerraWidget } from '@/components/TerraWidget/composables/useTerraWidget';
import { useLoading } from '@/composables/useLoading';
import { watch } from 'vue';

const { endUsers, getEndUsers } = useTerraWidget();

const { loading } = useLoading([getEndUsers()]);

const emit = defineEmits<{
  updated: [];
}>();

watch(loading, (value) => {
  if (value) {
    return;
  }
  emit('updated');
});
</script>

<template>
  <template v-if="!loading">
    <template v-for="terraData in endUsers" :key="terraData.terraUserId">
      <TerraWidget
        v-if="terraData.slides.length > 0"
        :class="$attrs.class"
        :device-name="terraData.deviceName"
        :terra-user-id="terraData.terraUserId"
        :slides="terraData.slides"
        :last-sync="terraData.lastSync"
        @disconnected="emit('updated')"
      />
    </template>
  </template>
  <SkeletonComponent v-else :class="$attrs.class" />
</template>
