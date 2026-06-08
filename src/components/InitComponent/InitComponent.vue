<script setup lang="ts">
/*
  This component waits for all of the logic required for application to be loaded before starting rendering anything.
  It can't be implemented in App.vue because async script setup requires <Suspense> to present in parent.
*/
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const userStore = useUserStore();

await userStore.getSessionInfo();

if (!userStore.isGuest) {
  await userStore.getProfile();
}

/*
  If you need something more to wait for before application will be initialized, add it here.
  Remember that if any of child components will have async script setup, it will be handled by <Suspense> automatically
*/

// Waiting to receive critical data
// await ...

const route = useRoute();
const layout = computed(() => route.meta.layout);
const layoutProps = computed(() => route.meta.layoutProps || {});
</script>

<template>
  <component v-if="layout" :is="layout" v-bind="layoutProps" />
  <RouterView v-else />
  <!-- Avoid adding anything here, it will decrease customizability. Use layouts instead -->
</template>
