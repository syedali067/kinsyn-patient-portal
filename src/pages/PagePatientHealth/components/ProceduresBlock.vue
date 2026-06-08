<script setup lang="ts">
import { sortByStartDate } from '../composables/useMammothSorting';
import type { Procedure } from '@/api/integrations/mammoth/types.ts';
// import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
import { format } from 'date-fns';
import { computed, ref } from 'vue';

const props = defineProps<{
  procedures: Procedure[];
}>();

const isShowMore = ref(false);

const sortedProcedures = computed(() => {
  return [...(props.procedures || [])].sort(sortByStartDate);
});

const displayListProcedures = computed(() => {
  return isShowMore.value ? sortedProcedures.value : sortedProcedures.value.slice(0, 4);
});
</script>

<template>
  <section class="rounded-8 flex flex-col gap-32 bg-white px-24 pt-24">
    <h2 class="text-26 font-secondary">{{ $t('procedures') }}</h2>

    <ul class="flex flex-col" :class="{ 'max-h-520 overflow-auto': isShowMore }">
      <li v-for="(item, index) in displayListProcedures" :key="item.id">
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
              {{ item.title }}
            </p>
            <p class="text-14 text-stone">
              <span v-if="item.startDate">{{ $t('travelInfo') }}:</span>
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
      v-if="sortedProcedures.length > 4"
      theme="outline"
      class="mb-24 w-fit"
      size="37"
      @click="isShowMore = !isShowMore"
    >
      {{ isShowMore ? $t('showLess') : $t('showMore') }}
    </BaseButton>
  </section>
</template>
