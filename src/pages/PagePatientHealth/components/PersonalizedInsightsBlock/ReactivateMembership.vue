<script setup lang="ts">
import IconCheckCircle from '@/assets/icons/check-circle.svg?component';
import IconLogo from '@/assets/icons/logo.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';

defineEmits<{
  openModal: [];
}>();
</script>

<template>
  <figure class="lg:rounded-8 relative -mx-16 h-543 overflow-hidden lg:mx-0 lg:h-608">
    <img
      src="@/assets/images/collection.jpg"
      alt="Kinsyn"
      class="size-full object-cover"
      data-testpl="reactivate-membership-image"
    />
    <div class="absolute inset-0 mt-8 flex flex-col justify-center p-16 lg:mt-0 lg:p-64">
      <div class="flex h-full flex-col justify-between">
        <div class="flex flex-col gap-4">
          <IconLogo class="h-28 w-172 text-white" />
          <span class="text-21 font-secondary text-white">{{ $t('membership') }}</span>
        </div>

        <div class="mt-auto mr-18 flex flex-col gap-8 lg:mt-0 lg:mr-0">
          <p class="font-secondary text-26 lg:text-32 text-white">
            {{ $t('regainAccessToYourFullHealthProfile') }}
          </p>

          <p class="text-14 text-white">
            {{ $t('unlockYourPersonalizedHealthViewWithAnActivePlan') }}
          </p>
        </div>

        <ul class="mt-24 flex flex-col gap-16 text-white lg:mt-0">
          <li class="flex items-center gap-8">
            <IconCheckCircle />
            <p>{{ $t('personalizedPlan') }}</p>
          </li>
          <li class="flex items-center gap-8">
            <IconCheckCircle />
            <p>{{ $t('hassleFreeDelivery') }}</p>
          </li>
          <li class="flex items-center gap-8">
            <IconCheckCircle />
            <p>{{ $t('accessToOurWellnessPlatform') }}</p>
          </li>
          <li class="flex items-center gap-8">
            <IconCheckCircle />
            <p>{{ $t('supportInEveryStep') }}</p>
          </li>
        </ul>

        <BaseButton
          color="light"
          class="mt-24 w-fit lg:mt-0"
          data-testpl="reactivate-membership-button"
          @click="$emit('openModal')"
        >
          {{ $t('reactivateMembership') }}
        </BaseButton>
      </div>
    </div>
  </figure>
</template>
