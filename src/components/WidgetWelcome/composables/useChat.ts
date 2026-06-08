import { apiChat } from '@/api/chats';
import { computedAsync } from '@vueuse/core';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export const useChat = () => {
  const { t } = useI18n();

  const getLastUnreadChatsMessageCountResponse = computedAsync(
    () => apiChat.getPatientUnreadChatMessageCount(),
    null,
  );
  const lastUnreadChatsMessageCount = computed(() =>
    Number(getLastUnreadChatsMessageCountResponse.value?.data.value?.data),
  );

  const greeting = getGreetingByTime(new Date());

  function getGreetingByTime(date: Date) {
    const hours = date.getHours();

    if (hours >= 5 && hours < 12) {
      return t('goodMorning');
    } else if (hours >= 12 && hours < 18) {
      return t('goodAfternoon');
    } else if (hours >= 18 && hours < 22) {
      return t('goodEvening');
    } else {
      return t('goodNight');
    }
  }

  return {
    lastUnreadChatsMessageCount,
    greeting,
  };
};
