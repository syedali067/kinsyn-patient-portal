<script setup lang="ts">
import BaseCheckbox from '@/components/BaseCheckbox/BaseCheckbox.vue';
import { useUserUpdate } from '@/composables/useUserUpdate.ts';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';

const userStore = useUserStore();
const { updateProfile, updateProfileLoading } = useUserUpdate();

const consentEmailGeneralMarketing = ref(
  userStore.profile?.user?.consentEmailGeneralMarketing ?? false,
);
const consentEmailPersonalizedQuiz = ref(
  userStore.profile?.user?.consentEmailPersonalizedQuiz ?? false,
);
const consentEmailPersonalizedHealth = ref(
  userStore.profile?.user?.consentEmailPersonalizedHealth ?? false,
);
const smsStop = ref(userStore.profile?.user?.smsStop ?? false);
const consentSmsMarketing = ref(
  smsStop.value ? false : (userStore.profile?.user?.consentSmsMarketing ?? false),
);
const consentSmsTransactional = ref(
  smsStop.value ? false : (userStore.profile?.user?.consentSmsTransactional ?? false),
);

const handleChange = async (
  type:
    | 'consentEmailGeneralMarketing'
    | 'consentEmailPersonalizedQuiz'
    | 'consentEmailPersonalizedHealth'
    | 'consentSmsMarketing'
    | 'consentSmsTransactional',
  value: boolean,
) => {
  if (!userStore.userId) return;

  const refMap = {
    consentEmailGeneralMarketing,
    consentEmailPersonalizedQuiz,
    consentEmailPersonalizedHealth,
    consentSmsMarketing,
    consentSmsTransactional,
  };

  const selectedRef = refMap[type];

  const updatedProfile = await updateProfile(userStore.userId, {
    user: { [type]: value },
  });

  if (updatedProfile) {
    userStore.profile = updatedProfile;
    selectedRef.value = updatedProfile.user[type] ?? false;
  } else {
    selectedRef.value = userStore.profile?.user?.[type] ?? false;
  }
};
</script>

<template>
  <section data-testpl="account-communication" class="rounded-8 flex flex-col gap-24 bg-white p-24">
    <p>{{ $t('communicationPreference') }}</p>

    <p class="text-14">{{ $t('chooseHowYouPreferToReceiveAllAccountNotifications') }}</p>

    <div class="flex flex-col gap-16">
      <p class="font-medium">{{ $t('emailPreferences') }}</p>

      <BaseCheckbox
        v-model="consentEmailGeneralMarketing"
        data-testpl="account-communication-email-general-marketing"
        :disabled="updateProfileLoading"
        @update:model-value="handleChange('consentEmailGeneralMarketing', $event)"
      >
        <span class="text-beige">{{ $t('receiveGeneralMarketingEmails') }}</span>
      </BaseCheckbox>

      <BaseCheckbox
        v-model="consentEmailPersonalizedQuiz"
        data-testpl="account-communication-email-personalized-quiz"
        :disabled="updateProfileLoading"
        @update:model-value="handleChange('consentEmailPersonalizedQuiz', $event)"
      >
        <span class="text-beige">{{ $t('receivePersonalizedMarketingEmailsQuiz') }}</span>
      </BaseCheckbox>

      <BaseCheckbox
        v-model="consentEmailPersonalizedHealth"
        data-testpl="account-communication-email-personalized-health"
        :disabled="updateProfileLoading"
        @update:model-value="handleChange('consentEmailPersonalizedHealth', $event)"
      >
        <span class="text-beige">{{ $t('receivePersonalizedMarketingEmailsHealth') }}</span>
      </BaseCheckbox>
    </div>

    <div class="flex flex-col gap-16">
      <p class="font-medium">{{ $t('smsPreferences') }}</p>

      <BaseCheckbox
        v-model="consentSmsMarketing"
        data-testpl="account-communication-sms-marketing"
        :disabled="updateProfileLoading || smsStop"
        @update:model-value="handleChange('consentSmsMarketing', $event)"
      >
        <span class="text-beige">{{ $t('receiveOccasionalPromotionalTexts') }}</span>
      </BaseCheckbox>

      <BaseCheckbox
        v-model="consentSmsTransactional"
        data-testpl="account-communication-sms-transactional"
        :disabled="updateProfileLoading || smsStop"
        @update:model-value="handleChange('consentSmsTransactional', $event)"
      >
        <span class="text-beige">{{ $t('receiveTransactionalTexts') }}</span>
      </BaseCheckbox>

      <p v-if="smsStop" class="text-secondary-text text-12">
        {{ $t('smsStopMessage') }}
      </p>
    </div>
  </section>
</template>
