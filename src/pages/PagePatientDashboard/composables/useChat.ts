import { apiChat } from '@/api/chats';
import { computedAsync } from '@vueuse/core';
import { computed, ref } from 'vue';

export const useChat = () => {
  const isLoadingLastUnreadChatsMessage = ref(false);

  const getLastUnreadChatsMessageResponse = computedAsync(
    () => apiChat.getLastUnreadChatsMessageFromProvider(),
    null,
    isLoadingLastUnreadChatsMessage,
  );

  const lastUnreadChatsMessage = computed(
    () => getLastUnreadChatsMessageResponse.value?.data.value?.data,
  );

  return {
    isLoadingLastUnreadChatsMessage,
    lastUnreadChatsMessage,
  };
};
