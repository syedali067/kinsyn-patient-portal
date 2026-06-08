<script setup lang="ts">
import type { InsuranceProvider } from '@/api/integrations/mammoth/types.ts';
// import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import IconPhone from '@/assets/icons/phone.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
// import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { computed, ref } from 'vue';

const props = defineProps<{
  insurance: InsuranceProvider[];
}>();

// const breakpoints = useBreakpoints(breakpointsTailwind);
// const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const isShowMore = ref(false);

const displayListPlanActivities = computed(() => {
  return isShowMore.value ? props.insurance : props.insurance?.slice(0, 4) || [];
});
</script>

<template>
  <section class="rounded-8 flex flex-col gap-32 bg-white px-24 pt-24">
    <h2 class="text-26 font-secondary">{{ $t('insurance') }}</h2>

    <ul class="flex flex-col" :class="{ 'max-h-520 overflow-auto': isShowMore }">
      <li v-for="(item, index) in displayListPlanActivities" :key="item.id">
        <BaseSeparator v-if="index !== 0" class="bg-bone" />
        <div
          class="flex flex-col items-start justify-between gap-28 py-24 lg:flex-row lg:items-center lg:gap-8"
          :class="{ 'pt-24': index !== 0, '!pt-0 pb-24': index === 0 }"
        >
          <div class="flex w-full min-w-0 flex-col gap-8">
            <span class="text-10 text-beige font-medium uppercase">
              {{ item.status ?? $t('notApplicable') }}
            </span>
            <span class="text-18 lg:text-21 lg:font-secondary break-words whitespace-normal">
              {{ item.title ?? $t('notApplicable') }}
            </span>
            <span v-if="item.policyNo" class="text-14 text-stone">
              {{ $t('policyNo') }}: {{ item.policyNo }}
            </span>
            <span v-else>$t('notApplicable')</span>
          </div>

          <div class="flex w-full items-center justify-center gap-48 lg:justify-end">
            <a
              v-if="item.contactNo"
              :href="`tel:${item.contactNo}`"
              class="text-12 flex items-center gap-8 font-medium hover:underline"
            >
              <IconPhone class="size-20" />
              {{ item.contactNo }}
            </a>

            <!-- TODO: hidden within task KS-1052, as there is currently no description of what should happen when clicked -->
            <!-- <BaseButton v-if="greaterOrEqualLg" size="32" rounded color="gray" class="shrink-0">
              <template #append>
                <IconArrowRight class="size-20" />
              </template>
            </BaseButton> -->
          </div>
        </div>
      </li>
    </ul>

    <BaseButton
      v-if="insurance.length > 4"
      theme="outline"
      class="mb-24 w-fit"
      size="37"
      @click="isShowMore = !isShowMore"
    >
      {{ isShowMore ? $t('showLess') : $t('showMore') }}
    </BaseButton>
  </section>
</template>
