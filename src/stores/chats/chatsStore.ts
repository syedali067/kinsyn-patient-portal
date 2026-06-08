import { apiChat } from '@/api/chats';
import type { PatientChat } from '@/types/chat';
import type { CategorySlug } from '@/types/treatment';
import { CHAT_REFRESH_INTERVAL } from '@/utils/constants';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useChatsStore = defineStore('chats', () => {
  const chats = ref<PatientChat[]>([]);
  const interval = ref<NodeJS.Timeout>();
  const blockNextRequest = ref(false);
  const refreshChatMessages = async () => {
    if (blockNextRequest.value) {
      return true;
    }

    try {
      blockNextRequest.value = true;
      const response = await apiChat.getChats();

      if (response.statusCode.value !== 200) {
        return false;
      }

      if (response.data.value?.data) {
        chats.value = response.data.value.data;
      }

      return true;
    } finally {
      blockNextRequest.value = false;
    }
  };

  const unreadChatMessages = computed(() =>
    chats.value.reduce((total, chat) => {
      return total + (chat.countUnreadMessage || 0);
    }, 0),
  );

  const lastUnreadPatientChat = computed<PatientChat | null>(
    () =>
      chats.value
        .filter(
          (chat) =>
            chat.lastProviderMessage &&
            !chat.lastProviderMessage.isReadByPatient &&
            chat.countUnreadMessage > 0,
        )
        .sort((a, b) => {
          const dateA = new Date(a.lastProviderMessage!.dateCreated).getTime();
          const dateB = new Date(b.lastProviderMessage!.dateCreated).getTime();
          return dateB - dateA;
        })[0] ?? null,
  );

  const readOneMessage = (category: CategorySlug, chatId: number) => {
    chats.value.forEach((chat) => {
      if (chat.id === chatId && chat.category === category) {
        chat.countUnreadMessage = Math.max(chat.countUnreadMessage - 1, 0);
      }
    });
  };

  const clearTimer = () => {
    clearInterval(interval.value);
    interval.value = undefined;
  };

  const startTimer = () => {
    // first init request
    refreshChatMessages();
    interval.value = setInterval(async () => {
      const response = await refreshChatMessages();
      if (!response) {
        clearTimer();
      }
    }, CHAT_REFRESH_INTERVAL);
  };

  return {
    chats,
    refreshChatMessages,
    unreadChatMessages,
    startTimer,
    clearTimer,
    readOneMessage,
    lastUnreadPatientChat,
  };
});
