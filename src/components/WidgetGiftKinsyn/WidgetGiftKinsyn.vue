<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue';

defineProps<{
  code: string;
}>();
</script>

<template>
  <div class="rounded-8 relative h-280 p-24 text-white">
    <picture class="pointer-events-none absolute top-0 left-0 z-0 h-full w-full">
      <img
        src="@/assets/images/gift-kinsyn.jpeg"
        alt="gift-kinsyn-bg"
        draggable="false"
        class="absolute top-0 left-0 h-full w-full object-cover select-none"
      />

      <div class="bg-coal/50 rounded-8 absolute inset-0" />
    </picture>

    <div class="relative z-10 flex h-full flex-col justify-between gap-32 text-white">
      <div class="flex flex-col gap-16">
        <h2 class="text-32 font-secondary">{{ $t('gift') }} KINSYN</h2>
        <p class="text-14">{{ $t('shareHappierHealthierFutureAndDiscount') }}</p>
      </div>
      <BaseButton theme="outline" class="border-none bg-white">
        {{ $t('useCode') }} {{ code }}
      </BaseButton>
    </div>
  </div>
</template>
