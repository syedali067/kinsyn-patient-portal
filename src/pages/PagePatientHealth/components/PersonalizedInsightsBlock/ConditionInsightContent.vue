<script setup lang="ts">
import IconChevronRight from '@/assets/icons/chevron-right.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import type { HealthInsightCondition } from '@/types/health';

defineProps<{
  insight: HealthInsightCondition;
}>();
</script>

<template>
  <div class="flex flex-col gap-40">
    <div v-if="insight.summary" class="flex flex-col gap-24">
      <span class="text-18">{{ $t('summary') }}</span>

      <div v-if="insight.summary?.status" class="flex flex-col gap-8">
        <span class="text-10 text-stone font-medium uppercase">{{ $t('status') }}</span>

        <p class="lg:text-14">
          {{ insight.summary?.status }}
        </p>
      </div>

      <div v-if="insight.summary?.whyItMatters" class="flex flex-col gap-8">
        <span class="text-10 text-stone font-medium uppercase">
          {{ $t('whyItMatters') }}
        </span>

        <p class="lg:text-14">
          {{ insight.summary?.whyItMatters }}
        </p>
      </div>
    </div>

    <div v-if="insight.findings" class="flex flex-col gap-24">
      <span class="text-18">{{ $t('verifiedFindings') }}</span>

      <div v-if="insight.findings.diagnosis" class="flex flex-col gap-8">
        <span class="text-10 text-stone font-medium uppercase">
          {{ $t('diagnosis') }}
        </span>

        <p class="lg:text-14">{{ insight.findings?.diagnosis }}</p>
      </div>

      <div v-if="insight.findings?.treatment" class="flex flex-col gap-8">
        <span class="text-10 text-stone font-medium uppercase">
          {{ $t('treatment') }}
        </span>

        <p class="lg:text-14">
          {{ insight.findings?.treatment }}
        </p>
      </div>

      <div v-if="insight.findings?.pastSurgeries" class="flex flex-col gap-8">
        <span class="text-10 text-stone font-medium uppercase">
          {{ $t('pastSurgeries') }}
        </span>

        <p class="lg:text-14">
          {{ insight.findings?.pastSurgeries }}
        </p>
      </div>
    </div>

    <div v-if="insight.recommendation.length" class="flex flex-col gap-24">
      <span class="text-18">{{ $t('recommendations') }}</span>

      <ul class="flex flex-col gap-24">
        <li
          v-for="recommendation in insight.recommendation"
          :key="recommendation"
          class="lg:text-14"
        >
          {{ recommendation }}
        </li>
      </ul>
    </div>

    <div v-if="insight.recommendedProducts.length" class="flex flex-col gap-40">
      <div class="flex items-center justify-between">
        <span class="text-18 capitalize">{{ $t('recommendedProducts') }}</span>

        <!-- TODO: removed the "Add to Cart" button, as currently the logic for it is non-existent. -->
        <!-- <BaseButton theme="outline" size="37">
          <template #prepend>
            <IconShoppingBag class="size-20" />
          </template>

          {{ $t('addAll') }}
        </BaseButton> -->
      </div>

      <div
        v-for="product in insight.recommendedProducts"
        :key="product.productId"
        class="flex w-full flex-col gap-16"
      >
        <div class="rounded-8 bg-site-bg flex items-center gap-16 p-16">
          <figure v-if="product.image" class="rounded-4 size-64 shrink-0 overflow-hidden">
            <img class="h-full w-full object-cover" :src="product.image" :alt="product.title" />
          </figure>

          <div class="flex w-full flex-col gap-8">
            <span class="text-10 text-beige font-medium uppercase">
              {{ product.category }}
            </span>

            <div class="flex w-full items-center justify-between gap-8">
              <span class="lg:text-21 lg:font-secondary">
                {{ product.title }}
              </span>
            </div>

            <p class="text-12 text-secondary-text">
              {{ product.description }}
            </p>

            <div class="flex items-center gap-8">
              <span v-if="product.price" class="flex grow items-baseline">
                ${{ Math.floor(product.price / 100) }}/mo
              </span>

              <BaseButton :href="`/${product.uri}`" rounded size="32" :title="$t('learnMore')">
                <template #append>
                  <IconChevronRight class="size-20" />
                </template>
              </BaseButton>
            </div>
          </div>
        </div>

        <p class="text-12 text-secondary-text">{{ product.reason }}</p>
      </div>
    </div>

    <div v-if="insight.supplementRecommendations.length" class="flex flex-col gap-24">
      <span class="text-18">{{ $t('recommendations') }}</span>

      <div
        v-for="supplement in insight.supplementRecommendations"
        :key="supplement.name"
        class="flex flex-col gap-6 lg:gap-8"
      >
        <span class="lg:text-14"> {{ supplement.name }}</span>

        <span class="text-12 text-secondary-text"> {{ supplement.description }}</span>
      </div>
    </div>
  </div>
</template>
