<script setup lang="ts">
import { sortByDate } from '../../composables/useMammothSorting';
import type { Immunization } from '@/api/integrations/mammoth/types.ts';
// import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
import BaseTabs from '@/components/BaseTabs/BaseTabs.vue';
import { format } from 'date-fns';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  data?: Immunization[];
}>();

const { t } = useI18n();

const currentTab = ref('done');
const isShowMore = ref(false);

const tabs = computed(() => {
  return [
    {
      label: `${t('done')} (${doneImmunizations.value.length})`,
      id: 'done',
    },
    {
      label: `${t('notDone')} (${notDoneImmunizations.value.length})`,
      id: 'notDone',
    },
  ].filter((tab) => {
    if (doneImmunizations.value.length === 0 && tab.id === 'done') {
      return false;
    }
    return !(notDoneImmunizations.value.length === 0 && tab.id === 'notDone');
  });
});

const doneImmunizations = computed(() => {
  if (!props.data) return [];

  return props.data
    .filter((item) => {
      return item.status === 'completed';
    })
    .sort(sortByDate);
});

const notDoneImmunizations = computed(() => {
  if (!props.data) return [];

  return props.data
    .filter((item) => {
      return item.status === 'not-done';
    })
    .sort(sortByDate);
});

const displayListImmunizations = computed(() => {
  if (isShowMore.value) {
    return currentTab.value === 'done' ? doneImmunizations.value : notDoneImmunizations.value;
  } else {
    return currentTab.value === 'done'
      ? doneImmunizations.value.slice(0, 4)
      : notDoneImmunizations.value.slice(0, 4);
  }
});

if (doneImmunizations.value.length === 0) {
  currentTab.value = 'notDone';
} else {
  currentTab.value = 'done';
}

watch(currentTab, () => {
  isShowMore.value = false;
});
</script>

<template>
  <section class="rounded-b-8 rounded-tr-8 flex flex-col gap-32 bg-white p-24">
    <div class="flex flex-col justify-between gap-16 lg:flex-row lg:items-center">
      <h2 class="text-26 font-secondary">{{ $t('immunization') }}</h2>
      <BaseTabs :tabs v-model="currentTab" />
    </div>

    <ul
      v-if="data?.length"
      class="flex flex-col"
      :class="{ 'max-h-520 overflow-auto': isShowMore }"
    >
      <li v-for="(item, index) in displayListImmunizations" :key="item.id">
        <BaseSeparator v-if="index !== 0" class="bg-bone" />
        <div
          class="flex items-center justify-between gap-8 py-24"
          :class="{ 'pt-24': index !== 0, '!pt-0 pb-24': index === 0 }"
        >
          <div class="flex min-w-0 flex-col gap-8">
            <p class="text-10 text-beige font-medium" :class="{ uppercase: item.route }">
              {{ item.route ?? $t('notSpecified') }}
            </p>
            <p class="text-18 lg:text-21 lg:font-secondary break-words whitespace-normal">
              {{ item.title ?? $t('notSpecified') }}
            </p>
            <p v-if="currentTab === 'done'" class="text-14 text-stone">
              <span v-if="item.date">{{ $t('lastDosage') }}:</span>
              {{ item.date ? format(item.date, 'MMM d, yyyy') : $t('notSpecified') }}
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
    <span v-else class="text-14 text-stone">{{ $t('noData') }}</span>
    <BaseButton
      v-if="currentTab === 'valid' ? doneImmunizations.length > 4 : notDoneImmunizations.length > 4"
      theme="outline"
      class="mb-24 w-fit"
      size="37"
      @click="isShowMore = !isShowMore"
    >
      {{ isShowMore ? $t('showLess') : $t('showMore') }}
    </BaseButton>
  </section>
</template>
