<script setup lang="ts">
import type { Encounter } from '@/api/integrations/mammoth/types.ts';
// import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
import BaseTabs from '@/components/BaseTabs/BaseTabs.vue';
import { format } from 'date-fns';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  appointments: Encounter[];
}>();

const { t } = useI18n();

const currentTab = ref('upcoming');
const isShowMore = ref(false);

const tabs = computed(() => {
  return [
    {
      label: `${t('upcoming')} (${upcomingAppointments.value.length})`,
      id: 'upcoming',
    },
    {
      label: `${t('previous')} (${previousAppointments.value.length})`,
      id: 'previous',
    },
  ].filter((tab) => {
    if (upcomingAppointments.value.length === 0 && tab.id === 'upcoming') {
      return false;
    }
    return !(previousAppointments.value.length === 0 && tab.id === 'previous');
  });
});

const now = new Date();

const upcomingAppointments = computed(() => {
  if (!props.appointments) return [];

  return props.appointments.filter((item) => {
    const date = new Date(item.startDate as string);
    return date > now && !isNaN(date.getTime());
  });
});

const previousAppointments = computed(() => {
  if (!props.appointments) return [];

  return props.appointments.filter((item) => {
    const date = new Date(item.startDate as string);
    return date <= now || isNaN(date.getTime());
  });
});

const displayListAppointments = computed(() => {
  if (isShowMore.value) {
    return currentTab.value === 'upcoming'
      ? upcomingAppointments.value
      : previousAppointments.value;
  } else {
    return currentTab.value === 'upcoming'
      ? upcomingAppointments.value.slice(0, 4)
      : previousAppointments.value.slice(0, 4);
  }
});

if (upcomingAppointments.value.length === 0) {
  currentTab.value = 'previous';
} else if (previousAppointments.value.length === 0) {
  currentTab.value = 'upcoming';
}

watch(currentTab, () => {
  isShowMore.value = false;
});
</script>

<template>
  <section class="rounded-8 flex flex-col gap-32 bg-white px-24 pt-24">
    <h2 class="text-26 font-secondary">{{ $t('appointments') }}</h2>

    <BaseTabs :tabs v-model="currentTab" />

    <ul class="flex flex-col" :class="{ 'max-h-520 overflow-auto': isShowMore }">
      <li v-for="(item, index) in displayListAppointments" :key="item.id">
        <BaseSeparator v-if="index !== 0" class="bg-bone" />
        <div
          class="flex items-center justify-between gap-8 py-24"
          :class="{ 'pt-24': index !== 0, '!pt-0 pb-24': index === 0 }"
        >
          <div class="flex min-w-0 flex-col gap-8">
            <p class="text-10 text-beige font-medium" :class="{ uppercase: item.location }">
              {{ item.location ?? $t('notSpecified') }}
            </p>
            <p class="text-18 lg:text-21 lg:font-secondary break-words whitespace-normal">
              {{ item.title ?? $t('notSpecified') }}
            </p>
            <p class="text-14 text-stone">
              {{
                item.startDate
                  ? `${format(item.startDate, 'MMM d, yyyy')} at ${format(item.startDate, 'h:mm a')}`
                  : $t('notSpecified')
              }}
            </p>
          </div>

          <!-- TODO: hidden within task KS-1052, as there is currently no description of what should happen when clicked -->
          <!-- <BaseButton size="32" rounded color="gray" class="shrink-0">
            <template #append>
              <IconArrowRight class="size-20" />
            </template>
          </BaseButton> -->
        </div>
      </li>
    </ul>

    <BaseButton
      v-if="
        currentTab === 'upcoming'
          ? upcomingAppointments.length > 4
          : previousAppointments.length > 4
      "
      theme="outline"
      class="mb-24 w-fit"
      size="37"
      @click="isShowMore = !isShowMore"
    >
      {{ isShowMore ? $t('showLess') : $t('showMore') }}
    </BaseButton>
  </section>
</template>
