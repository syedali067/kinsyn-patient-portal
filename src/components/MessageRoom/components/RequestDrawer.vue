<script setup lang="ts">
import BaseAvatar from '@/components/BaseAvatar/BaseAvatar.vue';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import { FAQ_LINK } from '@/constants/links';
import { formatPrice } from '@/utils/formatters';
import { ref } from 'vue';

/* TODO: Mock data */
const price = ref(2500);

const model = defineModel<boolean>();

defineProps<{
  provider: {
    id: number;
    fullName: string;
    avatarUrl: string | null;
  };
}>();
</script>

<template>
  <BaseDialog v-model:open="model" position="right" class="max-w-424">
    <template #header>
      {{ $t('requestASession') }}
    </template>

    <template #content>
      <div class="flex h-full flex-col justify-between gap-24">
        <div class="flex flex-col gap-16">
          <div class="border-bone flex justify-between gap-8 border-b pb-16">
            <div class="flex items-center gap-8">
              <BaseAvatar :name="provider.fullName" :src="provider.avatarUrl" />

              <div class="flex flex-col">
                <div class="text-disabled-text text-12">
                  {{ $t('meetingWith') }}
                </div>

                <div class="text-14">
                  {{ provider.fullName }}
                </div>
              </div>
            </div>

            <BaseButton class="min-w-155">
              {{ $t('schedule') }}
            </BaseButton>
          </div>

          <i18n-t keypath="pleaseNote$NoShowFeeApplies" tag="p" class="text-12 text-secondary-text">
            <template #value>
              <span class="text-coal">
                {{ formatPrice(price) }}
                {{ $t('noShowFee') }}
              </span>
            </template>
          </i18n-t>
        </div>

        <div class="flex flex-col gap-24">
          <img
            src="@/assets/images/request-a-session.jpg"
            alt="delivery"
            class="rounded-8 max-h-120 max-w-210"
          />

          <div class="flex flex-col gap-12">
            <p class="text-18">
              {{ $t('questionsAboutPaymentsOrShipping') }}
            </p>

            <p class="text-14 text-secondary-text">
              {{ $t('ourSupportTeamIsAvailableToAssistYou') }}
            </p>
          </div>

          <BaseButton class="w-full" theme="outline" :to="FAQ_LINK">
            {{ $t('FAQ') }} & {{ $t('support') }}
          </BaseButton>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
