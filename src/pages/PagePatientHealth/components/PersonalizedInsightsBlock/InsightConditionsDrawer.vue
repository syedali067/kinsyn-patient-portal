<script setup lang="ts">
import ConditionInsightContent from './ConditionInsightContent.vue';
import BaseAccordion from '@/components/BaseAccordion/BaseAccordion.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import type { HealthInsightCondition } from '@/types/health';
import { computed } from 'vue';

const model = defineModel<boolean>();

const props = defineProps<{
  conditionInsights: HealthInsightCondition[];
  title: string;
}>();

const firstConditionInsight = computed(() => {
  return props.conditionInsights?.[0];
});
</script>

<template>
  <BaseDialog
    v-model:open="model"
    position="right"
    class="max-w-672"
    data-testpl="insight-conditions-drawer"
  >
    <template #header>
      <span class="text-26 lg:text-40 font-secondary text-beige">
        {{ title || $t('allConditions') }}
        <span v-if="conditionInsights.length > 1">({{ conditionInsights.length }})</span>
      </span>
    </template>

    <template #content>
      <BaseAccordion
        v-if="conditionInsights.length > 1"
        :length="conditionInsights.length"
        class="-mx-8"
        data-testpl="insight-conditions-drawer-accordion"
      >
        <template v-for="(item, index) in conditionInsights" :key="index" #[`title-${index}`]>
          <span
            class="text-21 lg:text-26 font-secondary text-left"
            data-testpl="insight-conditions-drawer-accordion-title"
          >
            {{ item.title }}
          </span>
        </template>

        <template v-for="(item, index) in conditionInsights" :key="index" #[`content-${index}`]>
          <ConditionInsightContent :insight="item" />
        </template>
      </BaseAccordion>

      <div v-else-if="firstConditionInsight" class="flex flex-col gap-24">
        <span class="text-26 font-secondary">
          {{ firstConditionInsight.conditionName }}
        </span>

        <ConditionInsightContent :insight="firstConditionInsight" />
      </div>
    </template>
  </BaseDialog>
</template>
