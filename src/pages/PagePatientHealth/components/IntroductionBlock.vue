<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import type { CategorySlug } from '@/types/treatment';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  treatmentCategoryCounter: Record<CategorySlug, number>;
}>();

const { t } = useI18n();

interface BannerCategory {
  categorySlug: CategorySlug;
  bannerText: string;
  bannerButtonText: string;
}

const bannerCategory = computed<BannerCategory>(() => {
  if (props.treatmentCategoryCounter['weight-management'] > 0) {
    return {
      categorySlug: 'longevity',
      bannerText: t('exploreSomeTreatmentsForHealthyAndGracefulAging', {
        category: t('longevity'),
      }),
      bannerButtonText: t('exploreLongevity'),
    };
  }

  return {
    categorySlug: 'weight-management',
    bannerText: t('exploreSomeTreatmentsForHealthyAndGracefulAging', {
      category: t('weightManagement'),
    }),
    bannerButtonText: t('exploreWeightManagement'),
  };
});
</script>

<template>
  <section class="rounded-8 relative h-377 p-24 text-white">
    <picture class="pointer-events-none absolute top-0 left-0 h-full w-full">
      <img
        src="@/assets/images/introduction.jpg"
        alt="introduction"
        draggable="false"
        class="rounded-8 absolute top-0 left-0 h-full w-full object-cover select-none"
      />
    </picture>

    <div class="relative flex h-full flex-col justify-between">
      <h2 class="text-26 font-secondary">{{ bannerCategory.bannerText }}</h2>
      <BaseButton
        :to="{
          name: 'PatientPharmacyCategory',
          params: {
            categorySlug: bannerCategory.categorySlug,
          },
        }"
        theme="outline"
        class="border-none bg-white"
      >
        {{ bannerCategory.bannerButtonText }}
      </BaseButton>
    </div>
  </section>
</template>
