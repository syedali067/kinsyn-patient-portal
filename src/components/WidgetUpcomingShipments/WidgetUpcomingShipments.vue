<script setup lang="ts">
import SkeletonComponent from './components/SkeletonComponent.vue';
import WidgetComponent from './components/WidgetComponent.vue';
import { useLoading } from '@/composables/useLoading';
import { useShipments } from '@/composables/useShipments';
import { watch } from 'vue';

const { upcomingShipmentsItems, getUpcomingShipmentsItems } = useShipments();

const { loading } = useLoading([getUpcomingShipmentsItems({ perPage: 4 })]);

const emit = defineEmits<{
  loaded: [];
}>();

watch(loading, (value) => {
  if (value) {
    return;
  }
  emit('loaded');
});
</script>

<template>
  <SkeletonComponent v-if="loading" :class="$attrs.class" />
  <WidgetComponent v-else :class="$attrs.class" :shipments-items="upcomingShipmentsItems" />
</template>
