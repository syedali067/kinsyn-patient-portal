<script setup lang="ts">
import LabResultDrawer from './LabResultDrawer.vue';
import type { LabResultGroup } from '@/api/integrations/mammoth/types.ts';
import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
import type { LabResult, Patient } from '@/types/integration.ts';
import { format } from 'date-fns';
import { computed, ref } from 'vue';

const props = defineProps<{
  mammothData: Patient;
}>();

const displayListLabResults = computed(() => {
  return isShowMore.value
    ? props.mammothData?.labResultGroups
    : props.mammothData?.labResultGroups?.slice(0, 4) || [];
});

const currentLabResult = ref<LabResult | null>(null);
const isShowMore = ref(false);
const isLabResultModalOpen = ref(false);

const findResult = (id: LabResultGroup['id']) =>
  props.mammothData.labResults.find((result) => result.groupId === id);

const handleClickLabResult = (group: LabResultGroup) => {
  const foundResult = findResult(group.id);

  if (foundResult) {
    currentLabResult.value = foundResult;
    currentLabResult.value.title = group.title;
    currentLabResult.value.location = group.location;
    isLabResultModalOpen.value = true;
  } else {
    currentLabResult.value = null;
  }
};

const checkForItems = (group: LabResultGroup) => {
  return !!findResult(group.id) && (findResult(group.id)?.results?.length ?? 0) > 0;
};
</script>

<template>
  <section class="rounded-8 flex flex-col gap-32 bg-white px-24 pt-24">
    <div class="flex flex-col justify-between gap-8 lg:flex-row lg:items-center lg:gap-16">
      <h2 class="text-26 font-secondary">{{ $t('labResults') }}</h2>
      <p class="text-12 lg:text-14 text-secondary-text">
        {{ $t('lastUpdated') }}: {{ format(mammothData.updatedAt, 'MMM d, yyyy') }}
      </p>
    </div>
    <ul class="flex flex-col" :class="{ 'max-h-420 overflow-auto': isShowMore }">
      <li v-for="(item, index) in displayListLabResults" :key="item.id">
        <BaseSeparator v-if="index !== 0" class="bg-bone" />
        <div
          class="flex items-center justify-between gap-8 py-24"
          :class="{ 'pt-24': index !== 0, '!pt-0 pb-24': index === 0 }"
        >
          <div class="flex flex-col gap-8">
            <p class="text-18 lg:text-21 font-secondary">
              {{ item.title }}
            </p>
            <p class="text-14 text-stone">
              {{ item.location ?? $t('notSpecified') }}
            </p>
          </div>

          <BaseButton
            v-if="checkForItems(item)"
            size="32"
            rounded
            color="gray"
            class="shrink-0"
            @click="handleClickLabResult(item)"
          >
            <template #append>
              <IconArrowRight class="size-20" />
            </template>
          </BaseButton>
        </div>
      </li>
    </ul>

    <BaseButton
      v-if="mammothData?.labResultGroups.length > 4"
      theme="outline"
      class="mb-24 w-fit"
      size="37"
      @click="isShowMore = !isShowMore"
    >
      {{ isShowMore ? $t('showLess') : $t('showMore') }}
    </BaseButton>

    <LabResultDrawer
      v-if="currentLabResult"
      v-model="isLabResultModalOpen"
      :lab-result="currentLabResult"
    />
  </section>
</template>
