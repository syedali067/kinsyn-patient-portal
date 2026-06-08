<script setup lang="ts">
import SkeletonComponent from './components/SkeletonComponent.vue';
import WidgetComponent from './components/WidgetComponent.vue';
import { useLoading } from '@/composables/useLoading';
import { usePharmacyStore } from '@/stores/pharmacy';
import { storeToRefs } from 'pinia';

const pharmacyStore = usePharmacyStore();
const { popularPharmacyProducts } = storeToRefs(pharmacyStore);
const { getPopularPharmacy } = pharmacyStore;

const { loading } = useLoading([getPopularPharmacy()]);
</script>

<template>
  <SkeletonComponent v-if="loading" :class="$attrs.class" />
  <WidgetComponent v-else :class="$attrs.class" :products="popularPharmacyProducts" />
</template>
