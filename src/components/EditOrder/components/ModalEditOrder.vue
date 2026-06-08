<script setup lang="ts">
import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';

const isOpen = defineModel<boolean>({ default: false });

const emits = defineEmits<{
  changeOrderQuantity: [];
  cancelOrder: [];
  changeShipmentDate: [];
  close: [];
}>();
</script>

<template>
  <BaseDialog v-model:open="isOpen" position="right" class="max-w-424" @close="emits('close')">
    <template #header>
      {{ $t('editOrder') }}
    </template>

    <template #content>
      <p class="text-14 text-secondary-text mb-32">
        {{ $t('changeYourOrderDetails') }}
      </p>

      <!--      TODO: remove comment then BE will be ready-->
      <!--      <div-->
      <!--        class="border-bone flex min-h-98 items-center gap-12 border-b py-24 first-of-type:border-t"-->
      <!--      >-->
      <!--        <div class="flex grow flex-col gap-8">-->
      <!--          <p class="text-18">Expedite shipment</p>-->

      <!--          <p class="text-14 text-secondary-text">Currently scheduled for: July 18th, 2024</p>-->
      <!--        </div>-->

      <!--        <BaseButton rounded color="gray" size="32" @click="emits('changeShipmentDate')">-->
      <!--          <template #append>-->
      <!--            <IconArrowRight />-->
      <!--          </template>-->
      <!--        </BaseButton>-->
      <!--      </div>-->

      <!--      <div-->
      <!--        class="border-bone flex min-h-98 items-center gap-12 border-b py-24 first-of-type:border-t"-->
      <!--      >-->
      <!--        <div class="flex grow flex-col gap-8">-->
      <!--          <p class="text-18">Change order Quantity</p>-->

      <!--          <p class="text-14 text-secondary-text">Currently: Every 3 months, 90days of supply</p>-->
      <!--        </div>-->

      <!--        <BaseButton rounded color="gray" size="32" @click="emits('changeOrderQuantity')">-->
      <!--          <template #append>-->
      <!--            <IconArrowRight />-->
      <!--          </template>-->
      <!--        </BaseButton>-->
      <!--      </div>-->

      <div
        class="border-bone flex min-h-98 items-center gap-12 border-b py-24 first-of-type:border-t"
      >
        <div class="flex grow flex-col gap-8">
          <p class="text-18">
            {{ $t('cancelTreatment') }}
          </p>
        </div>

        <BaseButton rounded color="gray" size="32" @click="emits('cancelOrder')">
          <template #append>
            <IconArrowRight />
          </template>
        </BaseButton>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-col gap-24">
        <figure class="rounded-8 pointer-events-none h-120 w-210 overflow-hidden">
          <img
            draggable="false"
            class="h-full w-full object-cover select-none"
            src="@/assets/images/box.jpg"
            alt="box"
          />
        </figure>

        <div class="flex flex-col gap-12">
          <p class="text-18">
            {{ $t('questionsAboutPaymentsOrShipping') }}
          </p>

          <p class="text-14 text-secondary-text">
            {{ $t('ourSupportTeamIsAvailableToAssistYou') }}
          </p>
        </div>

        <BaseButton disabled theme="outline"> {{ $t('FAQ') }} & {{ $t('support') }} </BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>
