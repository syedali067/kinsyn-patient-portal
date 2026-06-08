<script setup lang="ts">
import SkeletonComponent from './components/SkeletonComponent.vue';
import WidgetComponent from './components/WidgetComponent.vue';
import { apiCart } from '@/api/cart';
import { apiChat } from '@/api/chats';
import { useCart } from '@/components/WidgetWelcome/composables/useCart.ts';
import { useChat } from '@/components/WidgetWelcome/composables/useChat.ts';
import { useLoading } from '@/composables/useLoading.ts';
import { useUserStore } from '@/stores/user';
import { watch } from 'vue';

const emit = defineEmits<{
  loaded: [];
}>();

const { loading } = useLoading([
  apiChat.getPatientUnreadChatMessageCount.load(),
  apiCart.getCart(),
]);

watch(loading, (value) => {
  if (value) {
    return;
  }
  emit('loaded');
});

const userStore = useUserStore();
const { lastUnreadChatsMessageCount, greeting } = useChat();
const { cartItemsCount } = useCart();
</script>

<template>
  <SkeletonComponent v-if="loading" :class="$attrs.class" />
  <WidgetComponent
    v-else
    :class="$attrs.class"
    :message-count="lastUnreadChatsMessageCount"
    :cart-items-count="cartItemsCount"
    :greeting-text="greeting"
    :first-name="userStore.profile?.user.firstName"
  />
</template>
