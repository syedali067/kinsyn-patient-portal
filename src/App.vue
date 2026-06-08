<script setup lang="ts">
import BaseSpinner from '@/components/BaseSpinner/BaseSpinner.vue';
import InitComponent from '@/components/InitComponent/InitComponent.vue';
import ToastNotifications from '@/components/ToastNotifications/ToastNotifications.vue';
</script>

<template>
  <Suspense>
    <InitComponent />

    <template #fallback>
      <div class="fixed inset-0 z-9999 flex">
        <BaseSpinner class="m-auto size-48" />
      </div>
    </template>
  </Suspense>

  <ToastNotifications />
</template>
