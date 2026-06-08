<script setup lang="ts">
import BaseAvatar from '@/components/BaseAvatar/BaseAvatar.vue';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import MessageAttachment from '@/components/MessageRoom/components/MessageAttachment.vue';
import type { PreviewItem } from '@/components/ModalPreview/types';
import SafeText from '@/components/SafeText/SafeText.vue';
import { useUserStore } from '@/stores/user/userStore.ts';
import type { NewChatMessage } from '@/types/chat';
import type { SessionUserRole } from '@/types/user';
import { toTimeZone } from '@/utils/formatters';
import { messageOptions } from '@/utils/htmlSanitizerOptions';
import { useElementVisibility, watchDebounced } from '@vueuse/core';
import { parseISO } from 'date-fns';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  message: NewChatMessage;
}>();

const emit = defineEmits<{
  'set-as-read': [messageId: NewChatMessage['id'], role: SessionUserRole, chatId: number];
  preview: [value: PreviewItem];
}>();

const userStore = useUserStore();

const isReadMore = ref<boolean>(false);
const messageContent = ref<InstanceType<typeof SafeText>>();
const messageReadBlock = ref<HTMLDivElement>();

const isMe = computed(() => userStore.userId === props.message.user?.id);
const fullName = computed(() => `${props.message.user.firstName} ${props.message.user.lastName}`);
const isTempMessage = computed(() => props.message.isPending);

/* when we send messages we send them in expanded form */
const visible = ref<boolean>(!!isTempMessage.value);

const checkHeight = () => {
  if (messageContent.value && messageContent.value.element) {
    isReadMore.value = messageContent.value.element.scrollHeight > 126;
  }
};

const formattedDate = computed(() => {
  if (!props.message.dateCreated) return '';

  const date = parseISO(props.message.dateCreated);

  return toTimeZone(date, 'hh:mm a', userStore.profile?.timeZone?.value);
});

const isMessageReadByCurrentUser = computed(
  () =>
    (userStore.isPatient && props.message.isReadByPatient) ||
    ((userStore.isProviderManager || userStore.isProvider) && props.message.isReadByProvider),
);

const isMessageOnViewport = useElementVisibility(messageReadBlock, {
  threshold: 0.9,
});

if (userStore.isPatient) {
  watchDebounced(
    () => isMessageOnViewport.value,
    () => {
      if (isMessageOnViewport.value && !isMessageReadByCurrentUser.value && userStore.role) {
        emit('set-as-read', props.message.id, userStore.role, props.message.chatId);
      }
    },
    {
      immediate: true,
      debounce: 500,
    },
  );
}

onMounted(() => {
  checkHeight();
});
</script>

<template>
  <li
    :class="[
      'flex',
      {
        'flex-row-reverse': message.isPatient,
        'opacity-50': isTempMessage,
      },
    ]"
    data-testpl="message-item"
  >
    <div
      class="flex flex-col gap-8 lg:gap-12"
      :class="{
        'animate-[zoomIn_0.3s]': isTempMessage,
      }"
      data-testpl="message-item-wrapper"
    >
      <div class="flex items-center gap-8" data-testpl="message-item-user-block">
        <BaseAvatar v-if="!isMe" :name="fullName" :src="message.user.avatar" />

        <div class="flex flex-col" data-testpl="message-item-user-data">
          <p class="text-14" data-testpl="message-item-user-data-name">
            {{ isMe ? $t('you') : fullName }}
          </p>

          <span
            v-if="message.user.profession && !isMe"
            class="text-12 text-disabled-text"
            data-testpl="message-item-user-data-profession"
          >
            {{ message.user.profession }}
          </span>
        </div>
      </div>

      <div
        class="rounded-4 bg-bone relative flex max-w-509 min-w-250 flex-col gap-16 p-16 lg:gap-24 lg:p-24"
        data-testpl="message-item-content"
      >
        <div class="flex flex-col gap-16" data-testpl="message-item-content-text">
          <div
            class="relative overflow-hidden"
            :class="{
              'max-h-126': !visible,
            }"
            data-testpl="message-item-text-wrapper"
          >
            <SafeText
              ref="messageContent"
              tag="div"
              :text="message.message"
              :options="messageOptions"
              class="text-14 prose"
              data-testpl="message-item-text-value"
            />

            <div
              v-if="isReadMore && !visible"
              class="from-bone absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t to-transparent"
              data-testpl="message-item-text-read-more-gradient"
            />
          </div>

          <BaseButton
            v-if="isReadMore && !visible"
            theme="link"
            class="w-fit font-medium"
            data-testpl="message-item-show-more-btn"
            @click="visible = true"
          >
            {{ $t('showMore') }}
          </BaseButton>
        </div>

        <hr
          v-if="message.message && message.attachments.length !== 0"
          class="border-coal/25 border"
          data-testpl="message-item-hr"
        />

        <ul
          v-if="message.attachments.length !== 0"
          class="flex flex-col gap-8"
          data-testpl="message-item-attachments-list"
        >
          <MessageAttachment
            v-for="attachment in message.attachments"
            :key="attachment.id"
            :attachment="attachment"
            @preview="emit('preview', $event)"
          />
        </ul>

        <div
          ref="messageReadBlock"
          class="flex items-center gap-6"
          data-testpl="message-item-read-block"
        >
          <span class="text-10 lg:text-14 text-secondary-text" data-testpl="message-item-date">
            {{ formattedDate }}
          </span>
        </div>
      </div>
    </div>
  </li>
</template>
