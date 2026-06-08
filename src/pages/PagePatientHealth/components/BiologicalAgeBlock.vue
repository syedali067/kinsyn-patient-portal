<script setup lang="ts">
import { useBiologicalAge } from '../composables/useBiologicalAge';
import bgBiologicalAge from '@/assets/images/bg-biological-age.jpg';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { differenceInYears, format } from 'date-fns';
import { computed } from 'vue';

const { biologicalAge } = useBiologicalAge();

const ageDifference = computed(() => {
  if (!biologicalAge.value?.dateOfBirth || !biologicalAge.value?.omicAge) return;
  const chronologicalAge = differenceInYears(new Date(), new Date(biologicalAge.value.dateOfBirth));
  return Math.floor(biologicalAge.value.omicAge - chronologicalAge);
});

const handleScheduleVisit = () => {
  window.location.href = '/quiz/biomarkers';
};
</script>
<template>
  <div
    class="rounded-8 relative col-span-4 flex flex-col overflow-hidden p-24"
    :class="[biologicalAge ? 'bg-white' : 'h-383']"
  >
    <template v-if="!biologicalAge || !biologicalAge.omicAge">
      <img
        :src="bgBiologicalAge"
        :alt="$t('learnYourBiologicalAge')"
        class="absolute inset-0 size-full object-cover object-top"
      />
      <div class="relative z-10 flex h-full flex-col justify-between gap-16 text-white">
        <h2 class="text-26 font-secondary capitalize">
          {{ $t('biologicalAge') }}
        </h2>

        <div class="flex flex-col gap-32">
          <div class="flex flex-col gap-12">
            <p class="text-18">{{ $t('getTheAddOnTestToCalculateYourBiologicalAge') }}</p>
            <p class="text-12">
              {{ $t('learnHowYourBiologicalAgeCompares') }}
            </p>
          </div>

          <BaseButton color="light" class="lg:w-fit" @click="handleScheduleVisit">
            {{ $t('learnYourBiologicalAge') }}
          </BaseButton>
        </div>
      </div>
    </template>

    <div v-else class="flex h-full flex-col justify-between">
      <div class="flex flex-col gap-16">
        <h2 class="text-21 lg:text-26 font-secondary">
          {{ $t('biologicalAge') }}
        </h2>
        <span class="text-96 font-secondary text-stone">{{ biologicalAge.omicAge }}</span>
        <i18n-t
          v-if="ageDifference"
          keypath="yourBiologicalAgeIsYearsYoungerThanYourCalendarAge"
          tag="span"
          class="text-14"
        >
          <template #years>
            {{ Math.abs(ageDifference) }}
          </template>
          <template #difference>
            {{ ageDifference < 0 ? $t('younger') : $t('older') }}
          </template>
        </i18n-t>

        <span v-if="biologicalAge.reportDate" class="text-14 text-secondary-text">
          {{
            $t('basedOnYourLabTestsFromDate', {
              date: format(biologicalAge.reportDate, 'MMM yyyy'),
            })
          }}
        </span>
      </div>
    </div>
  </div>
</template>
