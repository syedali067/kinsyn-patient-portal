<script setup lang="ts">
import { useTreatment } from './composables/useTreatment';
import { apiPharmacy } from '@/api/pharmacy';
import { apiTreatment } from '@/api/treatment';
import BaseCounter from '@/components/BaseCounter/BaseCounter.vue';
import BaseSpinner from '@/components/BaseSpinner/BaseSpinner.vue';
import MessageRoom from '@/components/MessageRoom/MessageRoom.vue';
import NoTreatmentPlan from '@/components/NoTreatmentPlan/NoTreatmentPlan.vue';
import { usePharmacy } from '@/composables/usePharmacy';
import { useStaticData } from '@/composables/useStaticData';
import { useChatsStore } from '@/stores/chats';
import { useUserStore } from '@/stores/user';
import type { PatientChat } from '@/types/chat';
import type { CategorySlug } from '@/types/treatment';
import { waitTransition } from '@/utils/pageTransition.ts';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { RouterLink } from 'vue-router';

const route = useRoute();
const router = useRouter();
const chatId = computed(() => +(route.params.chatId ?? 0));

const userStore = useUserStore();
const chatsStore = useChatsStore();

/*
  chatsStore.refreshChatMessages() here because we need to know
  at this stage where to go if we have an unread message
*/
await Promise.all([
  waitTransition(),
  apiPharmacy.getPharmacy(),
  chatsStore.refreshChatMessages(),
  apiTreatment.getTreatments({ patientId: userStore.userId as number }),
]);

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');
const { categories } = useStaticData();

const { pharmacyCategories } = usePharmacy();
const { treatments } = useTreatment();

const currentChats = computed(() => {
  const result = {} as Record<CategorySlug, PatientChat[]>;
  categories.value.forEach((category) => {
    result[category.id] = chatsStore.chats.filter((chat) => chat.category === category.id);
  });
  return result;
});

const currentChatCategory = computed(() =>
  categories.value.find((category) => category.id === route.params.category),
);

onMounted(() => {
  if (chatsStore.lastUnreadPatientChat) {
    router.push({
      name: 'PatientMessages',
      params: {
        category: chatsStore.lastUnreadPatientChat.category,
        chatId: chatsStore.lastUnreadPatientChat.id,
      },
    });
    return;
  }

  const firstChat = chatsStore.chats[0];
  if (firstChat && greaterOrEqualLg.value && !chatId.value) {
    router.push({
      name: 'PatientMessages',
      params: {
        category: firstChat.category,
        chatId: firstChat.id,
      },
    });
  }
});
</script>

<template>
  <div class="h-full" data-page-in="fadeInUp" data-page-out="fadeOutUp">
    <section v-if="treatments.length !== 0" class="row h-full" data-testpl="patient-messages">
      <div
        v-if="greaterOrEqualLg ? chatsStore.chats.length > 1 : !chatId"
        class="rounded-8 col-span-4 h-full overflow-hidden lg:bg-white"
        data-testpl="patient-messages-navigation"
      >
        <div class="flex h-full flex-col gap-24 p-16 lg:gap-32 lg:p-24">
          <h1 class="text-21 font-secondary">
            {{ $t('messages') }}
          </h1>

          <ul
            class="flex flex-col gap-16 overflow-y-auto lg:gap-0"
            data-testpl="patient-messages-navigation-list"
          >
            <template v-for="category in categories" :key="category.id">
              <template v-if="currentChats[category.id].length > 0">
                <li
                  v-for="chat in currentChats[category.id]"
                  :key="chat.id"
                  data-testpl="patient-messages-navigation-list-item"
                >
                  <RouterLink
                    :to="{
                      name: 'PatientMessages',
                      params: {
                        category: category.id,
                        chatId: chat.id,
                      },
                    }"
                    class="lg:hover:bg-bone group rounded-8 flex items-center gap-8 bg-white p-16 transition-colors"
                    active-class="lg:bg-bone lg:[&>figure]:!bg-white/50 rounded-8"
                    data-testpl="patient-messages-navigation-list-item-link"
                  >
                    <figure
                      class="bg-bone flex size-48 flex-col items-center justify-center rounded-full transition-colors lg:group-hover:bg-white/50"
                      data-testpl="patient-messages-navigation-list-item-figure"
                    >
                      <component
                        :is="category.icon"
                        class="size-24"
                        data-testpl="patient-messages-navigation-list-item-icon"
                      />
                    </figure>

                    <p data-testpl="patient-messages-navigation-list-item-label">
                      {{ category.label }}
                    </p>

                    <BaseCounter
                      v-if="chat.lastProviderMessage && !chat.lastProviderMessage.isReadByPatient"
                      :model-value="chat.countUnreadMessage || 0"
                      class="z-1 ml-auto"
                    />
                  </RouterLink>
                </li>
              </template>

              <li v-else data-testpl="patient-messages-navigation-list-item">
                <span class="rounded-8 flex items-center gap-8 bg-white p-16">
                  <figure
                    class="bg-bone flex size-48 flex-col items-center justify-center rounded-full"
                    data-testpl="patient-messages-navigation-list-item-figure"
                  >
                    <component
                      :is="category.icon"
                      class="text-disabled-text size-24"
                      data-testpl="patient-messages-navigation-list-item-icon"
                    />
                  </figure>

                  <p
                    class="text-disabled-text"
                    data-testpl="patient-messages-navigation-list-item-label"
                  >
                    {{ category.label }}
                  </p>
                </span>
              </li>
            </template>
          </ul>
        </div>
      </div>

      <Suspense :timeout="0" suspensible>
        <MessageRoom
          v-if="chatId && userStore.userId"
          :patient-id="userStore.userId"
          :chat-id
          :category="currentChatCategory"
          class="col-span-full min-h-0 animate-[fadeIn_0.4s]"
          :class="{
            'lg:col-span-8': chatsStore.chats.length > 1,
          }"
        />

        <template #fallback>
          <div
            class="col-span-full flex min-h-0"
            :class="{
              'lg:col-span-8': chatsStore.chats.length > 1,
            }"
          >
            <BaseSpinner class="m-auto size-48" />
          </div>
        </template>
      </Suspense>
    </section>

    <NoTreatmentPlan v-else :title="$t('startYourTreatment')" :pharmacy-categories>
      <template #subtitle>
        <span>
          {{ $t('getFullAccessToYourNewHealthPortal') }}
        </span>
        <br />
        <span>
          {{ $t('messagesFromYourMedicalProvider') }}
        </span>
      </template>
    </NoTreatmentPlan>
  </div>
</template>
