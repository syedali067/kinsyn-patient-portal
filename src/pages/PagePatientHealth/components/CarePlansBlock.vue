<script setup lang="ts">
// import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
import type { Patient } from '@/types/integration.ts';
import { format } from 'date-fns';
import { computed, ref } from 'vue';

const props = defineProps<{
  mammothData: Patient;
}>();

const isShowMore = ref(false);

const displayListPlanActivities = computed(() => {
  const planList = props.mammothData?.carePlans?.flatMap((plan) => plan.activities);
  return isShowMore.value ? planList : planList?.slice(0, 4) || [];
});
</script>

<template>
  <section class="rounded-8 flex flex-col gap-32 bg-white px-24 pt-24">
    <div class="flex flex-col justify-between gap-8 lg:flex-row lg:items-center lg:gap-16">
      <h2 class="text-26 font-secondary">{{ $t('planOfCare') }}</h2>
      <p class="text-12 lg:text-14 text-secondary-text">
        {{ $t('lastUpdated') }}:
        {{ format(mammothData.updatedAt, 'MMM d, yyyy') }}
      </p>
    </div>

    <ul class="flex flex-col" :class="{ 'max-h-540 overflow-auto': isShowMore }">
      <li v-for="(item, index) in displayListPlanActivities" :key="index">
        <BaseSeparator v-if="index !== 0" class="bg-bone" />
        <div
          class="flex items-center justify-between gap-8 py-24"
          :class="{ 'pt-24': index !== 0, '!pt-0 pb-24': index === 0 }"
        >
          <div class="flex min-w-0 flex-col gap-8">
            <span class="text-10 text-beige font-medium uppercase">{{ item.status }}</span>
            <span class="text-21 font-secondary break-words whitespace-normal">
              {{ item.activity }}
            </span>
            <p class="text-14 text-stone">
              <span v-if="item.startDate">{{ $t('lastVisit') }}:</span>
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
      v-if="mammothData?.carePlans?.length > 4"
      theme="outline"
      class="mb-24 w-fit"
      size="37"
      @click="isShowMore = !isShowMore"
    >
      {{ isShowMore ? $t('showLess') : $t('showMore') }}
    </BaseButton>
  </section>
</template>
