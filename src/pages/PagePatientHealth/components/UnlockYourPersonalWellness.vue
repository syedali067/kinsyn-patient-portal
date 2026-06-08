<script setup lang="ts">
import IconLogo from '@/assets/icons/logo.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
</script>

<template>
  <section class="mb-40 flex flex-col gap-16 lg:gap-40">
    <h2 class="font-secondary text-24 lg:text-40 normal-case">
      {{ $t('unlockYourPersonalWellness') }}
    </h2>

    <div class="flex flex-col gap-40 lg:gap-24">
      <figure class="lg:rounded-8 relative -mx-16 h-543 overflow-hidden lg:mx-0 lg:h-480">
        <img
          src="@/assets/images/collection.jpg"
          alt="Kinsyn"
          class="size-full object-cover"
          data-testpl="unlock-your-personal-wellness-image"
        />
        <div
          class="absolute inset-0 mt-8 flex flex-col justify-center p-16 lg:mt-0 lg:p-32 xl:p-64"
        >
          <div class="flex h-full flex-col justify-between lg:max-w-[520px] xl:max-w-[423px]">
            <div class="flex flex-col gap-4">
              <IconLogo class="h-28 w-172 text-white" />
              <span class="text-21 text-white">{{ $t('membership') }}</span>
            </div>

            <div class="mt-auto mr-18 flex flex-col gap-8 lg:mt-0 lg:mr-0">
              <p class="font-secondary text-26 lg:text-32 text-white">
                {{ $t('buildYourFullHealthProfile') }}
              </p>

              <p class="text-14 text-white">
                {{ $t('unlockYourPersonalizedHealthViewWithAnActivePlan') }}.
                {{ $t('finishYourIntakeNowSoWeCanDesignAPrescriptionThatFitsYouPerfectly') }}
              </p>
            </div>

            <BaseButton
              color="light"
              class="mt-24 w-201 lg:mt-0"
              href="/quiz/membership"
              data-testpl="unlock-your-personal-wellness-become-a-member-button"
            >
              {{ $t('becomeAMember') }}
            </BaseButton>
          </div>
        </div>
      </figure>

      <div class="row gap-16 lg:gap-24">
        <div class="col-span-4 flex flex-col">
          <img
            src="@/assets/images/personalized-recommendations.jpg"
            :alt="$t('personalizedRecommendations')"
            data-testpl="unlock-your-personal-wellness-personalized-recommendations-image"
            class="rounded-8 lg:rounded-4 size-full object-cover lg:h-300"
          />
          <div class="flex flex-col gap-16 p-32 pl-8">
            <p class="text-21 lg:text-24 font-secondary font-medium capitalize">
              {{ $t('personalizedRecommendations') }}
            </p>
            <p class="text-14">
              {{ $t('synthesizeHealthHistoryLabTestsAndLifestyle') }}
            </p>
          </div>
        </div>

        <div class="col-span-4 flex flex-col">
          <img
            src="@/assets/images/comprehensive-labs.jpg"
            :alt="$t('comprehensiveLabs')"
            data-testpl="unlock-your-personal-wellness-comprehensive-labs-image"
            class="rounded-8 lg:rounded-4 size-full object-cover lg:h-300"
          />

          <div class="flex flex-col gap-16 p-32 pl-8">
            <p class="text-21 lg:text-24 font-secondary font-medium capitalize">
              {{ $t('comprehensiveLabs') }}
            </p>
            <p class="text-14">
              {{ $t('accessBiomarkerLabTestingAndDiscounted') }}
            </p>
          </div>
        </div>

        <div class="col-span-4 flex flex-col">
          <img
            src="@/assets/images/unlimited-access.jpg"
            :alt="$t('unlimitedAccess')"
            data-testpl="unlock-your-personal-wellness-unlimited-access-image"
            class="rounded-8 lg:rounded-4 size-full object-cover lg:h-300"
          />

          <div class="flex flex-col gap-16 p-32 pl-8">
            <p class="text-21 lg:text-24 font-secondary font-medium capitalize">
              24/7 {{ $t('unlimitedAccess') }}
            </p>
            <p class="text-14">
              {{ $t('messageYourProvidersAsOftenAsYoudLikeWheneverYoudLike') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
