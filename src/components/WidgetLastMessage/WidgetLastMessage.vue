<script setup lang="ts">
import SkeletonComponent from './components/SkeletonComponent.vue';
import WidgetComponent from './components/WidgetComponent.vue';
import { useLoading } from '@/composables/useLoading';
import { useChat } from '@/pages/PagePatientDashboard/composables/useChat';
import { awaiter } from '@/utils/awaiter';
import { watch } from 'vue';

defineProps<{
  hideTitle?: boolean;
}>();

const emit = defineEmits<{
  loaded: [];
}>();

const { lastUnreadChatsMessage, isLoadingLastUnreadChatsMessage } = useChat();
const { loading } = useLoading([awaiter(isLoadingLastUnreadChatsMessage)]);

watch(loading, (value) => {
  if (value) {
    return;
  }
  emit('loaded');
});
</script>

<template>
  <SkeletonComponent v-if="loading" :class="$attrs.class" />
  <WidgetComponent v-else :class="$attrs.class" :message="lastUnreadChatsMessage" :hide-title />
</template>
