<script setup lang="ts">
import SkeletonComponent from './components/SkeletonComponent.vue';
import WidgetComponent from './components/WidgetComponent.vue';
import { useLoading } from '@/composables/useLoading';
import { useTerra } from '@/composables/useTerra';
import { awaiter } from '@/utils/awaiter';
import { watch } from 'vue';

const { terraEndUser, isTerraLoading } = useTerra();

const { loading } = useLoading([awaiter(isTerraLoading)]);

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
  <WidgetComponent v-else :class="$attrs.class" :terra="terraEndUser" />
</template>
