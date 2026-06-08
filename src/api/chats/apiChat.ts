import type { CreateChatMessagePayload } from './types';
import { useApi, stringifyQuery } from '@/composables/useApi.ts';
import type { ChatMessage, NewChatMessage, PatientChat } from '@/types/chat';
import type { NewPaginationPayload } from '@/types/pagination';
import type { Response, NewResponse } from '@/types/response';
import { useMemoize } from '@vueuse/core';

/* don't use memoize here because we need to constantly update the counter with unread messages */
const getChats = () => {
  return useApi<NewResponse<PatientChat[] | null>>(`/api/v3/patient/chats`).get();
};

const getChatMessages = (payload: NewPaginationPayload, chatId: number) => {
  const params = stringifyQuery({ ...payload });
  return useApi<NewResponse<NewChatMessage[]>>(
    `/api/v3/patient/chats/${chatId}/messages?${params}`,
  ).get();
};

const createChatMessage = (payload: CreateChatMessagePayload) => {
  const data = new FormData();

  Object.entries(payload.attachments).forEach(([key, value]) => {
    if (value instanceof Blob || typeof value === 'string') {
      data.append(`attachments[${key}]`, value);
    } else {
      data.append(`attachments[${key}]`, String(value));
    }
  });

  data.set('chatId', String(payload.chatId));
  data.set('message', payload.message);
  return useApi<Response<ChatMessage>>('/api/v1/chats/create-message').post(data);
};

const markMessageRead = (messageId: number) => {
  return useApi<Response<null>>('/api/v1/chats/mark-messages-read').post({ messageId });
};

const getLastUnreadChatsMessageFromProvider = useMemoize(() => {
  return useApi<Response<ChatMessage | null>>(
    '/api/v1/chats/last-chat-message-from-provider',
  ).get();
});

const getPatientUnreadChatMessageCount = useMemoize(() => {
  return useApi<Response<number>>('/api/v1/chats/patient-unread-messages-count').get();
});

export const apiChat = {
  getChats,
  getChatMessages,
  createChatMessage,
  markMessageRead,
  getLastUnreadChatsMessageFromProvider,
  getPatientUnreadChatMessageCount,
};
