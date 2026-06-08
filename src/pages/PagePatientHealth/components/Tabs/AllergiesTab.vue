<script setup lang="ts">
import type { Allergy } from '@/api/integrations/mammoth/types.ts';
// import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
import BaseTabs from '@/components/BaseTabs/BaseTabs.vue';
import { format } from 'date-fns';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  data?: Allergy[];
}>();

const { t } = useI18n();

const currentTab = ref('valid');
const isShowMore = ref(false);

const tabs = computed(() => {
  return [
    {
      label: `${t('active')} (${activeAllergies.value.length})`,
      id: 'active',
    },
    {
      label: `${t('past')} (${pastAllergies.value.length})`,
      id: 'past',
    },
  ].filter((tab) => {
    if (activeAllergies.value.length === 0 && tab.id === 'active') {
      return false;
    }
    return !(pastAllergies.value.length === 0 && tab.id === 'past');
  });
});

const activeAllergies = computed(() => {
  if (!props.data) return [];

  return props.data.filter((item) => {
    return item.status === 'Active';
  });
});

const pastAllergies = computed(() => {
  if (!props.data) return [];

  return props.data.filter((item) => {
    return item.status !== 'Active';
  });
});

const displayListImmunizations = computed(() => {
  if (isShowMore.value) {
    return currentTab.value === 'active' ? activeAllergies.value : pastAllergies.value;
  } else {
    return currentTab.value === 'active'
      ? activeAllergies.value.slice(0, 4)
      : pastAllergies.value.slice(0, 4);
  }
});

if (activeAllergies.value.length === 0) {
  currentTab.value = 'past';
} else {
  currentTab.value = 'active';
}

watch(currentTab, () => {
  isShowMore.value = false;
});
</script>

<template>
  <section class="rounded-b-8 rounded-tr-8 flex flex-col gap-32 bg-white p-24">
    <div class="flex flex-col justify-between gap-16 lg:flex-row lg:items-center">
      <h2 class="text-26 font-secondary">{{ $t('allergies') }}</h2>
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
          <div class="flex w-full min-w-0 gap-8">
            <div class="flex w-1/2 min-w-0 flex-col gap-8">
              <p class="text-10 text-beige font-medium" :class="{ uppercase: item.type }">
                {{ item.type ?? $t('notSpecified') }}
              </p>
              <p class="text-18 lg:text-21 lg:font-secondary break-words whitespace-normal">
                {{ item.allergy ?? $t('notSpecified') }}
              </p>
              <p class="text-14 text-stone">
                <span v-if="item.date">{{ $t('diagnosed') }}:</span>
                {{ item.date ? format(item.date, 'MMM d, yyyy') : $t('notSpecified') }}
              </p>
            </div>
            <div class="flex flex-col gap-8">
              <p class="text-10 text-beige font-medium uppercase">
                {{ $t('symptom') }}
              </p>
              <p class="text-14 text-stone">
                {{ item.reaction ?? $t('noReaction') }}
              </p>
            </div>
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
      v-if="currentTab === 'valid' ? activeAllergies.length > 4 : pastAllergies.length > 4"
      theme="outline"
      class="mb-24 w-fit"
      size="37"
      @click="isShowMore = !isShowMore"
    >
      {{ isShowMore ? $t('showLess') : $t('showMore') }}
    </BaseButton>
  </section>
</template>
