<script setup lang="ts">
import BaseSpinner from '../BaseSpinner/BaseSpinner.vue';
import ModalPreview from '../ModalPreview/ModalPreview.vue';
import type { PreviewItem } from '../ModalPreview/types';
import IconArrowLeft from '@/assets/icons/arrow-left.svg?component';
import IconMessages from '@/assets/icons/messages.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import ChatTextarea from '@/components/ChatTextarea/ChatTextarea.vue';
import MessageItem from '@/components/MessageRoom/components/MessageItem.vue';
/* turn it off for now */
/* import RequestDrawer from '@/components/MessageRoom/components/RequestDrawer.vue'; */
import { useChatMessages } from '@/composables/useChatMessages';
import { useChatsStore } from '@/stores/chats';
import type { ChatMessage, NewChatMessage } from '@/types/chat.ts';
import type { Category } from '@/types/treatment';
import type { SessionUserRole } from '@/types/user';
import { CHAT_REFRESH_INTERVAL, DEBOUNCE_DELAY } from '@/utils/constants';
import { useDebounceFn, useInfiniteScroll, useIntervalFn } from '@vueuse/core';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { format, isToday } from 'date-fns';
import { watch } from 'vue';
import { nextTick, ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  patientId: number;
  chatId: number;
  category?: Category;
}>();

const { t } = useI18n();
const chatsStore = useChatsStore();

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const startPage = 1;
const limit = 20;

const {
  fetchChatMessages,
  chatMessagesLoading,
  chatMessages,
  chatMessagesTotalCount,
  loadMoreChatMessagesLoading,
  loadMoreChatMessages,
  createMessage,
  setMessageIsRead,
} = useChatMessages(startPage, limit);

/* Update message room */
/*
  we always have a store with unread messages running in the background
  but when we go to the message room, we need to synchronize the current messages
  in the chat and the number of unread ones, we need the requests to arrive almost simultaneously
  otherwise we may have a situation where there is a counter for unread messages but there is no message itself
  so we stop the global store and start the local one while we are in the message room,
  as soon as we leave it we make it work in the background of the store
*/
const { pause } = useIntervalFn(async () => {
  await Promise.all([fetchChatMessages(props.chatId), chatsStore.refreshChatMessages()]);
}, CHAT_REFRESH_INTERVAL);

/* First render */
await fetchChatMessages(props.chatId, false, true);

const page = ref(startPage);
/* const isRequestDrawerVisible = ref(false); turn it off for now */
const isOpenModalPreview = ref(false);

const previewItem = ref<PreviewItem>();
const chatTextarea = ref<InstanceType<typeof ChatTextarea> | null>(null);
const messagesWrapper = ref<HTMLElement | null>(null);

const groupedByDateMessages = computed(() => {
  const groups: { date: string; messages: NewChatMessage[] }[] = [];
  let currentDate: string | null = null;

  [...chatMessages.value].reverse().forEach((message) => {
    const messageDate = new Date(message.dateCreated);
    const messageDateString = format(messageDate, 'd MMMM yyyy');

    const displayDate = isToday(messageDate) ? t('today') : messageDateString;

    if (displayDate !== currentDate) {
      currentDate = displayDate;
      groups.push({
        date: displayDate,
        messages: [message],
      });
    } else {
      groups[groups.length - 1]?.messages.push(message);
    }
  });

  groups.forEach((item) => item.messages.reverse());

  return groups;
});

const handlePreview = (item: PreviewItem) => {
  previewItem.value = item;
  isOpenModalPreview.value = true;
};

const scrollToBottom = async (behavior?: ScrollBehavior) => {
  if (messagesWrapper.value) {
    await nextTick();
    messagesWrapper.value.scrollTo({
      top: messagesWrapper.value.scrollHeight,
      left: 0,
      behavior,
    });
  }
};

const fetchChatMessagesDebounce = useDebounceFn(() => {
  fetchChatMessages(props.chatId);
}, DEBOUNCE_DELAY);

const onSendMessage = async ({
  message,
  attachments,
}: {
  message: string;
  attachments: File[];
}) => {
  if (await createMessage(props.chatId, message, attachments)) {
    chatTextarea.value?.clearRestoreForm();
    fetchChatMessagesDebounce();
    await scrollToBottom();
  } else {
    chatTextarea.value?.restoreForm();
  }
};

const onReadMessage = async (
  messageId: ChatMessage['id'],
  role: SessionUserRole,
  chatId: number,
) => {
  if (await setMessageIsRead(messageId, role)) {
    if (props.category?.id) {
      chatsStore.readOneMessage(props.category.id, chatId);
    }
  }
};

watch(
  () => props.chatId,
  async () => {
    page.value = startPage;
    await fetchChatMessages(props.chatId, true, true);
    await scrollToBottom('instant');
  },
);

onMounted(() => {
  chatsStore.clearTimer();

  useInfiniteScroll(
    messagesWrapper.value,
    async () => {
      if (loadMoreChatMessagesLoading.value) {
        return;
      }
      if (chatMessages.value.length >= chatMessagesTotalCount.value) {
        return;
      }
      page.value += 1;
      await loadMoreChatMessages(props.chatId, page.value);
    },
    { distance: 100, direction: 'top' },
  );
});

onUnmounted(() => {
  pause();
  chatsStore.startTimer();
});
</script>

<template>
  <!-- turn it off for now -->
  <!-- <RequestDrawer v-model="isRequestDrawerVisible" :provider /> -->
  <ModalPreview v-model="isOpenModalPreview" :item="previewItem" />

  <div
    v-bind="$attrs"
    class="lg:rounded-8 flex flex-col bg-white p-16 lg:p-24"
    data-testpl="message-room"
  >
    <div class="border-bone shrink-0 border-b pb-16">
      <div class="flex items-center justify-between gap-12">
        <div class="flex items-center gap-12">
          <BaseButton
            v-if="!greaterOrEqualLg"
            :to="{ name: 'PatientMessages' }"
            color="light"
            rounded
            data-testpl="message-room-back-btn"
          >
            <template #prepend>
              <IconArrowLeft class="size-20" />
            </template>
          </BaseButton>

          <p
            v-if="category"
            class="text-18 lg:text-26 lg:font-secondary"
            data-testpl="message-room-category-label"
          >
            {{ category.label }}
          </p>
        </div>

        <!-- turn it off for now -->
        <!-- <BaseButton
          class="ml-auto"
          :size="greaterOrEqualLg ? '44' : '40'"
          data-testpl="message-room-request-btn"
          @click="isRequestDrawerVisible = true"
        >
          {{ $t('requestASession') }}
        </BaseButton> -->
      </div>
    </div>

    <div class="flex h-full min-h-0 flex-col" data-testpl="message-room-block">
      <ul
        ref="messagesWrapper"
        class="flex flex-grow flex-col-reverse gap-8 overflow-y-auto py-24"
        data-testpl="message-room-list"
      >
        <li v-if="chatMessagesLoading" data-testpl="message-room-list-item-spinner">
          <BaseSpinner class="mx-auto size-20" />
        </li>

        <template v-if="chatMessages.length !== 0">
          <template v-for="group in groupedByDateMessages" :key="group.date">
            <li class="flex flex-col gap-8" data-testpl="message-room-list-item">
              <span
                class="text-12 text-secondary-text rounded-20 sticky top-8 z-10 mx-auto flex h-31 w-fit touch-none items-center justify-center bg-white px-12 py-8 shadow-sm"
                data-testpl="message-room-list-item-date"
              >
                {{ group.date }}
              </span>

              <ul
                class="flex flex-grow flex-col gap-24"
                data-testpl="message-room-list-item-message-list"
              >
                <MessageItem
                  v-for="message in group.messages"
                  :key="message.id"
                  :message
                  @preview="handlePreview"
                  @set-as-read="onReadMessage"
                />
              </ul>
            </li>
          </template>
        </template>

        <li
          v-else
          class="flex h-full flex-col items-center justify-center"
          data-testpl="message-room-list-item-no-messages"
        >
          <IconMessages class="size-40" />

          <span class="fond-bold mt-12">
            {{ $t('noMessagesFound') }}
          </span>

          <p class="text-14 text-secondary-text mt-16 max-w-276 text-center">
            {{ $t('messagesFromYourMedicalProviderWillAppearHereWhenYouStartATreatment') }}
          </p>
        </li>

        <li v-if="loadMoreChatMessagesLoading" data-testpl="message-room-list-item-spinner">
          <BaseSpinner class="mx-auto size-20" />
        </li>
      </ul>

      <footer
        class="relative mx-auto flex w-full max-w-824 flex-shrink-0 flex-col gap-16"
        data-testpl="message-room-footer"
      >
        <ChatTextarea ref="chatTextarea" :chat-id @send-message="onSendMessage" />
      </footer>
    </div>
  </div>
</template>
