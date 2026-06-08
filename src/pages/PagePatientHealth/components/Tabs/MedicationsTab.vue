<script setup lang="ts">
import type { Medication } from '@/api/integrations/mammoth/types.ts';
// import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
import BaseTabs from '@/components/BaseTabs/BaseTabs.vue';
import { format } from 'date-fns';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  data?: Medication[];
}>();

const { t } = useI18n();

const currentTab = ref<'active' | 'inactive'>('active');
const isShowMore = ref(false);

const tabs = computed(() => {
  return [
    {
      label: `${t('active')} (${activeMedications.value.length})`,
      id: 'active',
    },
    {
      label: `${t('inactive')} (${inactiveMedications.value.length})`,
      id: 'inactive',
    },
  ].filter((tab) => {
    if (activeMedications.value.length === 0 && tab.id === 'active') {
      return false;
    }
    return !(inactiveMedications.value.length === 0 && tab.id === 'inactive');
  });
});

const activeMedications = computed(() => {
  if (!props.data) return [];

  return props.data.filter((item) => {
    return item.status === 'active';
  });
});

const inactiveMedications = computed(() => {
  if (!props.data) return [];

  return props.data.filter((item) => {
    return item.status !== 'active';
  });
});

const displayListMedications = computed(() => {
  if (isShowMore.value) {
    return currentTab.value === 'active' ? activeMedications.value : inactiveMedications.value;
  } else {
    return currentTab.value === 'active'
      ? activeMedications.value.slice(0, 4)
      : inactiveMedications.value.slice(0, 4);
  }
});

if (activeMedications.value.length === 0) {
  currentTab.value = 'inactive';
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
      <h2 class="text-26 font-secondary">{{ $t('medicationsSupplements') }}</h2>
      <BaseTabs :tabs v-model="currentTab" />
    </div>

    <ul
      v-if="data?.length"
      class="flex flex-col"
      :class="{ 'max-h-520 overflow-auto': isShowMore }"
    >
      <li v-for="(item, index) in displayListMedications" :key="item.id">
        <BaseSeparator v-if="index !== 0" class="bg-bone" />
        <div
          class="flex items-center justify-between gap-8 py-24"
          :class="{ 'pt-24': index !== 0, '!pt-0 pb-24': index === 0 }"
        >
          <div class="flex min-w-0 flex-col gap-8">
            <p class="text-10 text-beige font-medium" :class="{ uppercase: item.status }">
              {{ item.status ?? $t('notSpecified') }}
            </p>
            <p class="text-18 lg:text-21 lg:font-secondary break-words whitespace-normal">
              {{ item.title ?? $t('notSpecified') }}
            </p>
            <p class="text-14 text-stone">
              <span v-if="item.startDate">{{ $t('lastPrescription') }}:</span>
              {{ item.startDate ? format(item.startDate, 'MMM d, yyyy') : $t('notSpecified') }}
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
      v-if="currentTab === 'active' ? activeMedications.length > 4 : inactiveMedications.length > 4"
      theme="outline"
      class="mb-24 w-fit"
      size="37"
      @click="isShowMore = !isShowMore"
    >
      {{ isShowMore ? $t('showLess') : $t('showMore') }}
    </BaseButton>
  </section>
</template>
