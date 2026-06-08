<script setup lang="ts">
import SkeletonComponent from './components/SkeletonComponent.vue';
import WidgetComponent from './components/WidgetComponent.vue';
import { useLoading } from '@/composables/useLoading';
import { useSubscriptions } from '@/pages/PagePatientDashboard/composables/useSubscriptions';
import { useUserStore } from '@/stores/user';
import { awaiter } from '@/utils/awaiter';
import { watch } from 'vue';

const userStore = useUserStore();

const { supplements, medications, loadingTreatments } = useSubscriptions(userStore.userId);

const { loading } = useLoading([awaiter(loadingTreatments)]);

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
    :supplements="supplements"
    :medications="medications"
  />
</template>
