<script setup lang="ts">
import SkeletonComponent from './components/SkeletonComponent.vue';
import WidgetComponent from './components/WidgetComponent.vue';
import { useHealth } from '@/composables/useHealth.ts';
import { useLoading } from '@/composables/useLoading';
import { useMammothConditions } from '@/composables/useMammothConditions';
import { useMammothFields } from '@/composables/useMammothFields';
import { awaiter } from '@/utils/awaiter';
import { watch } from 'vue';

const { mammothData, isMammothConditionsLoading } = useMammothConditions();
const { mammothFields, isMammothFieldsLoading } = useMammothFields();
const { fetchInsights, healthInsights } = useHealth();

const { loading } = useLoading([
  awaiter(isMammothConditionsLoading),
  awaiter(isMammothFieldsLoading),
  fetchInsights(),
]);

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
    :mammoth="mammothData"
    :fields="mammothFields"
    :conditions="healthInsights?.conditions"
  />
</template>
