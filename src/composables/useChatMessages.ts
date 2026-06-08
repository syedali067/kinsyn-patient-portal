import { apiChat } from '@/api/chats';
import { useToastStore } from '@/stores/toast';
import { useUserStore } from '@/stores/user';
import type {
  ChatMessageAttachment,
  ChatMessageAttachmentKind,
  NewChatMessage,
} from '@/types/chat';
import type { SessionUserRole, UserRole } from '@/types/user';
import { clearAllHTMLOptions, messageOptions } from '@/utils/htmlSanitizerOptions';
import DOMPurify from 'dompurify';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useChatMessages = (page: number = 0, limit: number = 20) => {
  const { t } = useI18n();
  const toastStore = useToastStore();
  const userStore = useUserStore();

  const chatMessages = ref<NewChatMessage[]>([]);
  const chatMessagesTotalCount = ref(0);

  const chatMessagesLoading = ref(false);
  const loadMoreChatMessagesLoading = ref(false);
  const createMessageLoading = ref(false);

  const fetchChatMessages = async (
    chatId: number,
    force: boolean = false,
    showLoading: boolean = false,
  ) => {
    try {
      if (showLoading) {
        chatMessagesLoading.value = true;
      }
      const response = await apiChat.getChatMessages(
        {
          page,
          limit,
        },
        chatId,
      );

      if (response.data.value?.data && response.data.value.pagination) {
        chatMessagesTotalCount.value = response.data.value.pagination.total;

        /*
          considering that we have a message update every 30 seconds,
          we can't just replace the entire array (especially if we scrolled far up)
        */
        const newMsgs = response.data.value.data.reverse();
        if (force) {
          chatMessages.value = newMsgs;
        } else {
          const serverMsgIds = new Set(newMsgs.map((msg) => msg.id));

          chatMessages.value = chatMessages.value.filter(
            (msg) => msg.id < 0 || serverMsgIds.has(msg.id),
          );

          const tempMessagesToRemove = chatMessages.value
            .filter((m) => m.id < 0) // All temporary messages have a negative ID
            .filter((tempMsg) =>
              newMsgs.some(
                (serverMsg) =>
                  DOMPurify.sanitize(serverMsg.message, clearAllHTMLOptions) ===
                    DOMPurify.sanitize(tempMsg.message, clearAllHTMLOptions) &&
                  serverMsg.attachments.length === tempMsg.attachments.length,
              ),
            );

          chatMessages.value = chatMessages.value.filter(
            (m) => !tempMessagesToRemove.some((temp) => temp.id === m.id),
          );

          newMsgs.forEach((msg: NewChatMessage) => {
            const found = chatMessages.value.find((m) => m.id === msg.id);
            if (!found) {
              chatMessages.value.push(msg);
            } else {
              found.isReadByProvider = msg.isReadByProvider;
              found.isReadByPatient = msg.isReadByPatient;
              found.attachments = msg.attachments;
            }
          });
        }
      }
    } finally {
      if (showLoading) {
        chatMessagesLoading.value = false;
      }
    }
  };

  const loadMoreChatMessages = async (chatId: number, nextPage: number) => {
    try {
      loadMoreChatMessagesLoading.value = true;
      const response = await apiChat.getChatMessages(
        {
          page: nextPage,
          limit,
        },
        chatId,
      );

      if (response.statusCode.value !== 200) {
        return;
      }

      if (response.data.value?.data) {
        const newMsgs = response.data.value.data;
        newMsgs.forEach((msg: NewChatMessage) => {
          const found = chatMessages.value.find((m) => m.id === msg.id);
          if (!found) {
            chatMessages.value.unshift(msg);
          } else {
            // Update only these fields, which could be updated later
            found.isReadByProvider = msg.isReadByProvider;
            found.isReadByPatient = msg.isReadByPatient;
            found.attachments = msg.attachments;
          }
        });
      }
    } finally {
      loadMoreChatMessagesLoading.value = false;
    }
  };

  const createMessage = async (chatId: number, message: string, attachments: File[]) => {
    try {
      createMessageLoading.value = true;

      const safeMessage = DOMPurify.sanitize(message, messageOptions);

      if (!safeMessage && !attachments.length) {
        toastStore.addToast({
          type: 'error',
          text: t('messageCannotBeEmpty'),
        });

        return false;
      }

      const tempAttachments: ChatMessageAttachment[] = attachments.map((file) => {
        const extension = file.name.split('.').pop()?.toLowerCase() || '';
        let kind: ChatMessageAttachmentKind = 'image';

        if (['pdf'].includes(extension)) {
          kind = 'pdf';
        } else if (['doc', 'docx'].includes(extension)) {
          kind = 'word';
        }

        return {
          id: Date.now(),
          url: URL.createObjectURL(file),
          title: file.name,
          filename: file.name,
          mimeType: file.type,
          kind,
          size: file.size,
          width: 0,
          height: 0,
        };
      });

      const tempMessage: NewChatMessage = {
        id: -Date.now(),
        chatId,
        message: safeMessage,
        user: {
          id: userStore.userId as number,
          firstName: userStore.profile?.user.firstName ?? '',
          lastName: userStore.profile?.user.lastName ?? '',
          avatar: userStore.avatar ?? '',
          roles: [userStore.role as UserRole],
        },
        attachments: tempAttachments,
        isReadByProvider: !(userStore.role === 'patients'),
        isReadByPatient: userStore.role === 'patients',
        isPatient: userStore.role === 'patients',
        dateCreated: new Date().toISOString(),
        isPending: true,
      };

      chatMessages.value = [...chatMessages.value, tempMessage];

      const res = await apiChat.createChatMessage({
        chatId,
        message: safeMessage,
        attachments,
      });

      if (res.statusCode.value !== 200 || !res?.data.value?.data.id) {
        tempAttachments.forEach((att) => URL.revokeObjectURL(att.url));
        chatMessages.value = chatMessages.value.filter((m) => m.id !== tempMessage.id);

        return false;
      }

      return true;
    } finally {
      createMessageLoading.value = false;
    }
  };

  const setMessageIsRead = async (messageId: NewChatMessage['id'], role: SessionUserRole) => {
    const res = await apiChat.markMessageRead(messageId);

    if (res.statusCode.value !== 200) {
      return false;
    }

    const readChatMessage = chatMessages.value.find((m) => m.id === messageId);

    if (readChatMessage) {
      if (role === 'providerUsers' || role === 'providers') {
        readChatMessage.isReadByProvider = true;
      } else if (role === 'patients') {
        readChatMessage.isReadByPatient = true;
      }
    }

    return true;
  };

  return {
    fetchChatMessages,
    chatMessagesLoading,
    chatMessages,
    chatMessagesTotalCount,
    loadMoreChatMessagesLoading,
    loadMoreChatMessages,
    createMessage,
    createMessageLoading,
    setMessageIsRead,
  };
};
