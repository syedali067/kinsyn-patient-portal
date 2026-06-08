<script setup lang="ts">
import IconArrowLeft from '@/assets/icons/arrow-left.svg?component';
import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { type DateValue } from '@internationalized/date';
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
} from 'reka-ui';

const date = defineModel<DateValue>();

const onChange = (v?: DateValue) => {
  date.value = v;
};
</script>

<template>
  <CalendarRoot
    :default-value="date"
    v-slot="{ weekDays, grid }"
    weekday-format="short"
    class="w-full uppercase"
    fixed-weeks
    @update:model-value="onChange"
  >
    <CalendarHeader class="mb-16 flex items-center justify-between">
      <CalendarPrev>
        <BaseButton rounded color="gray" size="32">
          <template #prepend>
            <IconArrowLeft class="size-20" />
          </template>
        </BaseButton>
      </CalendarPrev>

      <CalendarHeading class="text-14 truncate" />

      <CalendarNext>
        <BaseButton rounded color="gray" size="32">
          <template #prepend>
            <IconArrowRight class="size-20" />
          </template>
        </BaseButton>
      </CalendarNext>
    </CalendarHeader>

    <CalendarGrid
      v-for="month in grid"
      :key="month.value.toString()"
      class="text-14 w-full border-collapse select-none"
    >
      <CalendarGridHead>
        <CalendarGridRow class="grid w-full grid-cols-7">
          <CalendarHeadCell v-for="day in weekDays" :key="day" class="h-49 leading-49 font-normal">
            {{ day }}
          </CalendarHeadCell>
        </CalendarGridRow>
      </CalendarGridHead>

      <CalendarGridBody class="grid">
        <CalendarGridRow
          v-for="(weekDates, index) in month.rows"
          :key="`weekDate-${index}`"
          class="grid grid-cols-7"
        >
          <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
            <CalendarCellTrigger :day="weekDate" :month="month.value" class="cell" />
          </CalendarCell>
        </CalendarGridRow>
      </CalendarGridBody>
    </CalendarGrid>
  </CalendarRoot>
</template>

<style scoped>
@reference '@/assets/css/main.css';

.cell {
  @apply rounded-4 relative h-49 cursor-pointer text-center leading-49 outline-none;
}

.cell:hover {
  @apply bg-coal/20;
}

.cell[data-today]::before {
  content: '';
  @apply bg-coal absolute bottom-8 left-1/2 block h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full;
}

.cell[data-selected] {
  @apply bg-coal text-white;
}

.cell[outside-view] {
  @apply text-secondary-text;
}

.cell[data-unavailable] {
  @apply text-secondary-text pointer-events-none line-through;
}
</style>
