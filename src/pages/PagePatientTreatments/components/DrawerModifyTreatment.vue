<script setup lang="ts">
import { useTreatment } from '../composables/useTreatment';
import type { DrawerModifyTreatmentSubscription } from '../types';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import BaseEditor from '@/components/BaseEditor/BaseEditor.vue';
/* import { SubscriptionStatus } from '@/enums/subscription.ts'; */
import { useUserStore } from '@/stores/user';
import { watch } from 'vue';
import { reactive, ref } from 'vue';

const model = defineModel<boolean>();

const props = defineProps<{
  subscription?: DrawerModifyTreatmentSubscription;
}>();

const emit = defineEmits<{
  success: [value: void];
}>();

const userStore = useUserStore();

const {
  modifyTreatmentLoading,
  modifyTreatment,
  cancelTreatment,
  cancelTreatmentLoading,
  removeAddon,
  removeAddonLoading,
} = useTreatment();

const formData = reactive<{
  message: string;
}>({
  message: '',
});

const confirm = ref(false);

const handleModifyTreatment = async () => {
  if (
    props.subscription?.treatmentId &&
    (await modifyTreatment(props.subscription.treatmentId, formData.message))
  ) {
    formData.message = '';
    model.value = false;
  }
};

const handleCancelTreatmentOrRemoveAddon = async () => {
  if (!props.subscription) return;

  const { itemType, treatmentId } = props.subscription;
  let success = false;

  if (itemType === 'treatment' && treatmentId && userStore.email && userStore.userId) {
    success = await cancelTreatment(treatmentId, userStore.email, userStore.userId);
  } else if (itemType === 'addon' && treatmentId && props.subscription.refExternal) {
    success = await removeAddon(treatmentId, props.subscription.refExternal);
  }

  if (success) {
    model.value = false;
    emit('success');
  }
};

watch(model, (value) => {
  if (!value) {
    confirm.value = false;
  }
});
</script>

<template>
  <BaseDialog
    v-model:open="model"
    position="right"
    class="max-w-424"
    data-testpl="drawer-modify-treatment"
  >
    <template #header>
      <span class="capitalize">
        <template v-if="subscription?.planStatus === 'pending'">
          {{ $t('pendingApproval') }}
        </template>

        <template v-else>
          {{ $t('modifyPlan') }}
        </template>
      </span>
    </template>

    <template v-if="subscription" #content>
      <p class="text-14">
        <template v-if="subscription.planStatus === 'pending'">
          {{ $t('yourTreatmentIsCurrentlyUnderReview') }}
          {{ $t('weWillLetYouKnowOnceItHasBeenApprovedAndConfirmed') }}
          {{ $t('ifYouHaveAnyQuestionsFeelFreeToReachOutToUs') }}
          {{ $t('weAreHereToSupportYouEveryStep') }}
        </template>

        <template v-else>
          {{ $t('ifYoudLikeToModifyYourTreatment') }}
          <br />
          <br />
          {{ $t('ifYoudPreferToCancelThisTreatmentPleaseUseTheButtonBelow') }}
        </template>
      </p>

      <BaseEditor
        v-model="formData.message"
        :placeholder="$t('typeMessage')"
        field-class="h-140"
        class="mt-32"
      />

      <BaseButton
        :disabled="!formData.message"
        :loading="modifyTreatmentLoading"
        class="mt-24 w-full"
        data-testpl="drawer-modify-treatment-send-btn"
        @click="handleModifyTreatment"
      >
        {{ $t('send') }}
      </BaseButton>
    </template>

    <template #footer>
      <Transition
        mode="out-in"
        enter-active-class="animate-[zoomIn_0.3s]"
        leave-active-class="animate-[zoomOut_0.3s]"
      >
        <div v-if="!confirm" key="cancel">
          <!-- <BaseButton
            v-if="
              subscription?.itemType === 'treatment' &&
              (subscription?.subscriptionStatus !== SubscriptionStatus.Future ||
                subscription?.planStatus === 'declined')
            "
            theme="outline"
            class="w-full"
            data-testpl="drawer-modify-treatment-cancel-or-remove-btn"
            @click="confirm = true"
          >
            {{ $t('cancelTreatment') }}
          </BaseButton> -->

          <BaseButton
            v-if="subscription?.itemType === 'addon'"
            theme="outline"
            class="w-full"
            data-testpl="drawer-modify-treatment-cancel-or-remove-btn"
            @click="confirm = true"
          >
            {{ $t('removeAddon') }}
          </BaseButton>
        </div>

        <div v-else key="confirm" class="flex flex-col gap-12">
          <p class="text-center">
            <template v-if="subscription?.itemType === 'treatment'">
              {{ $t('areYouSureYouWantToCancelThisTreatment') }}
            </template>

            <template v-if="subscription?.itemType === 'addon'">
              {{ $t('areYouSureYouWantToRemoveThisAddon') }}
            </template>
          </p>

          <div class="flex gap-12">
            <BaseButton
              theme="outline"
              :loading="cancelTreatmentLoading || removeAddonLoading"
              class="w-full"
              data-testpl="drawer-modify-treatment-confirm-yes-btn"
              @click="handleCancelTreatmentOrRemoveAddon"
            >
              {{ $t('yes') }}
            </BaseButton>

            <BaseButton
              class="w-full"
              data-testpl="drawer-modify-treatment-confirm-no-btn"
              @click="confirm = false"
            >
              {{ $t('no') }}
            </BaseButton>
          </div>
        </div>
      </Transition>
    </template>
  </BaseDialog>
</template>
