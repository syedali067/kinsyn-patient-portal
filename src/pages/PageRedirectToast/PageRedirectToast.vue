<script setup lang="ts">
import { useRedirectToast } from './composables/useRedirectToast';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const { redirectToast } = useRedirectToast();
const route = useRoute();

onMounted(() =>
  redirectToast({
    deviceWidgetAuthFailure: {
      route: 'PatientHealth',
      type: 'error',
      message:
        route.query.reason === 'outside_of_mobile'
          ? t('pleaseUseYourPhoneToAccessThisFeature')
          : t('couldNotConnectDevice'),
    },
    deviceWidgetAuthSuccess: {
      route: 'PatientHealth',
      type: 'success',
      message: t('deviceWasConnected'),
    },
  }),
);
</script>

<template>
  <div></div>
</template>
