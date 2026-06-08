<script setup lang="ts">
import IconMessages from '@/assets/icons/messages.svg?component';
import BaseAvatar from '@/components/BaseAvatar/BaseAvatar.vue';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import SafeText from '@/components/SafeText/SafeText.vue';
import type { ChatMessage } from '@/types/chat';
import { messageOptions } from '@/utils/htmlSanitizerOptions';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { format } from 'date-fns';
import { computed, nextTick, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  message?: ChatMessage | null;
  hideTitle?: boolean;
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const messageRef = ref<InstanceType<typeof SafeText> | null>(null);
const showClamp = ref(false);

// if the text width is more than 180px, then after the first word (name) there will be a line break
const formattedFullName = computed(() => {
  const fullName = props.message?.user.fullName ?? '';

  if (!fullName) return null;

  // We split it into the first name and the rest (last name and tags)
  const [first, ...rest] = fullName.trim().split(' ');
  const surname = rest.join(' ');

  // Forming an HTML string with a container and two spans
  return `
    <span class="inline-flex flex-wrap max-w-full lg:max-w-180">
      <span>${first}&nbsp;</span>
      <span class="flex-shrink-0 whitespace-nowrap">${surname}</span>
    </span>
  `;
});

const measureHeight = () => {
  const el = messageRef.value?.element;
  if (el) {
    const height = el.offsetHeight;
    const maxHeight = greaterOrEqualLg.value ? 115 : 184;
    showClamp.value = height > maxHeight;
  }
};

onMounted(async () => {
  await nextTick();
  measureHeight();
});

watch(
  () => props.message?.message,
  async () => {
    await nextTick();
    measureHeight();
  },
);
</script>

<template>
  <div
    class="rounded-8 flex flex-col gap-24 bg-white p-16 lg:h-367 lg:gap-32 lg:p-24 lg:pr-80"
    data-testpl="dashboard-message"
  >
    <h2 v-if="!hideTitle" class="text-21 lg:text-26 font-secondary" data-testpl="card-header">
      {{ $t('messagesFromYourCareTeam') }}
    </h2>

    <div v-if="message" class="flex h-full flex-col gap-16 lg:flex-row lg:gap-56">
      <div
        v-if="message.user"
        class="flex min-w-fit flex-row items-center gap-12 lg:flex-col lg:items-start"
      >
        <BaseAvatar
          :name="message.user.fullName"
          :src="message.user.avatarUrl"
          :border="!message.user.avatarUrl"
          size="64"
          data-testpl="chat-message-avatar"
        />
        <div class="flex flex-col">
          <SafeText
            v-if="formattedFullName"
            :text="formattedFullName"
            :options="messageOptions"
            data-testpl="chat-message-name"
          />
          <p class="text-14 text-secondary-text">{{ message.user.profession }}</p>
        </div>
      </div>

      <div class="flex flex-col justify-between gap-24 lg:gap-32">
        <div class="flex flex-col gap-16 lg:gap-32">
          <span
            class="text-12 text-secondary-text bg-bone rounded-20 flex h-31 w-fit items-center justify-center px-12 py-8"
          >
            {{ format(message.dateCreated, 'd MMM yyyy') }}
          </span>
          <div
            class="relative overflow-hidden"
            :class="{
              'max-h-115': showClamp && greaterOrEqualLg,
              'max-h-184': showClamp && !greaterOrEqualLg,
            }"
          >
            <SafeText
              :text="message.message"
              ref="messageRef"
              :options="messageOptions"
              class="prose text-coal block leading-[150%]"
              data-testpl="chat-message-text"
            />
            <div
              v-if="showClamp"
              class="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-white to-transparent"
            />
          </div>
        </div>

        <BaseButton
          class="w-full lg:w-155"
          :to="{
            name: 'PatientMessages',
            params: { chatId: message.chatId, category: message.categorySlug },
          }"
          data-testpl="chat-message-read-more"
        >
          {{ $t('readMore') }}
        </BaseButton>
      </div>
    </div>

    <div v-else class="flex h-full flex-col items-center justify-center gap-16 px-16 lg:px-24">
      <IconMessages class="size-40" />
      <p class="text-14">
        {{ $t('youDontHaveAnyNewMessages') }}
      </p>
      <BaseButton :to="{ name: 'PatientMessages' }" data-testpl="chat-message-show-history">
        {{ $t('showMessageHistory') }}
      </BaseButton>
    </div>
  </div>
</template>
