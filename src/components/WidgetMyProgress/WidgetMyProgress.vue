<script setup lang="ts">
import SkeletonComponent from './components/SkeletonComponent.vue';
import WidgetComponent from './components/WidgetComponent.vue';
import { useLoading } from '@/composables/useLoading';
import { useProgress } from '@/composables/useProgress';
import { watch } from 'vue';

const startPageWeightProgress = 0;
const perPageWeightProgress = 10;

const { fetchWeightProgress, weightProgress, currentWeight, percentAchieved } = useProgress(
  startPageWeightProgress,
  perPageWeightProgress,
);

const { loading } = useLoading([fetchWeightProgress(true)]);

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
  <WidgetComponent
    v-else
    :class="$attrs.class"
    :progress="weightProgress"
    :current-weight="currentWeight"
    :percent-achieved="percentAchieved"
    :max-length="perPageWeightProgress"
  />
</template>
