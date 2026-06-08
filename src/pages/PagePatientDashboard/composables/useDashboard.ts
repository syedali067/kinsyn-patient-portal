import { apiCart } from '@/api/cart';
import { apiChat } from '@/api/chats';
import { computedAsync } from '@vueuse/core';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export const useDashboard = () => {
  const { t } = useI18n();

  const getLastUnreadChatsMessageResponse = computedAsync(
    () => apiChat.getLastUnreadChatsMessageFromProvider(),
    null,
  );

  const getLastUnreadChatsMessageCountResponse = computedAsync(
    () => apiChat.getPatientUnreadChatMessageCount(),
    null,
  );

  const getCartResponse = computedAsync(() => apiCart.getCart(), null);

  const lastUnreadChatsMessage = computed(
    () => getLastUnreadChatsMessageResponse.value?.data.value?.data,
  );

  const lastUnreadChatsMessageCount = computed(() =>
    Number(getLastUnreadChatsMessageCountResponse.value?.data.value?.data),
  );

  const cartItemsCount = computed(() => getCartResponse.value?.data.value?.data.items.length);

  const getGreetingByTime = (date: Date): string => {
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
  };

  return {
    lastUnreadChatsMessage,
    lastUnreadChatsMessageCount,
    cartItemsCount,
    getGreetingByTime,
  };
};
