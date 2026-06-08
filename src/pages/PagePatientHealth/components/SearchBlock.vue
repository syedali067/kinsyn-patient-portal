<script setup lang="ts">
import IconSearch from '@/assets/icons/search.svg?component';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const search = ref('');

const searchItems = computed(() => {
  return [
    {
      label: t('clinicalNotes'),
      value: 'Clinical Notes',
    },
    {
      label: t('planOfCare'),
      value: 'Plan of care',
    },
    {
      label: t('labResults'),
      value: 'Lab Results',
    },
  ];
});
</script>

<template>
  <section v-if="greaterOrEqualLg" class="rounded-8 flex flex-col gap-16 bg-white px-16 py-24">
    <h2 class="text-26 font-secondary">{{ $t('searchOnMyHealth') }}</h2>

    <BaseInput v-model="search" :placeholder="$t('searchATopic')">
      <template #append>
        <IconSearch />
      </template>
    </BaseInput>
  </section>

  <section v-else class="flex flex-col gap-24">
    <BaseInput v-model="search" :placeholder="$t('searchATopic')" class="rounded-4 bg-white">
      <template #append>
        <IconSearch />
      </template>
    </BaseInput>

    <div class="flex items-center gap-8 overflow-x-auto">
      <div
        v-for="item in searchItems"
        :key="item.value"
        class="rounded-4 text-14 flex h-40 min-w-fit items-center justify-center bg-white px-16"
      >
        {{ item.label }}
      </div>
    </div>
  </section>
</template>
