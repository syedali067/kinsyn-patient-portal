<script setup lang="ts">
import type { AiSetting } from '@/api/ai-settings/types.ts';
import BaseCheckbox from '@/components/BaseCheckbox/BaseCheckbox.vue';
import PoweredBy from '@/components/PoweredBy/PoweredBy.vue';
import { useAiSettings } from '@/composables/useAiSettings.ts';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');
const { aiSettingsEnabled, updateSettings, getAiSettings } = useAiSettings();
const isEnabled = ref(false);
const payload: AiSetting = {
  name: t('enableAiCompanion'),
  slug: 'enable_ai_companion',
  value: Number(isEnabled.value),
};
const saveSetting = async () => {
  payload.value = Number(isEnabled.value);
  await updateSettings({ settings: [payload] });
  isEnabled.value = aiSettingsEnabled.value;
};

await getAiSettings();

onMounted(() => {
  isEnabled.value = aiSettingsEnabled.value;
});
</script>

<template>
  <section class="rounded-8 flex flex-col gap-24 bg-white p-24">
    <div class="flex items-center justify-between gap-24">
      <p>{{ $t('aiCompanion') }}</p>
      <PoweredBy v-if="greaterOrEqualLg" />
    </div>

    <div class="flex gap-12">
      <BaseCheckbox v-model="isEnabled" @update:model-value="saveSetting" />
      <div class="flex flex-col gap-8">
        <p class="text-beige">{{ $t('enableAICompanion') }}</p>
        <p class="text-12 text-secondary-text max-w-330">
          {{ $t('aiCompanionProvidersPersonalizedRecommendationsAndHelpsYouWorkFaster') }}
        </p>
      </div>
    </div>

    <PoweredBy v-if="!greaterOrEqualLg" />
  </section>
</template>
