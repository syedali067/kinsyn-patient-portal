<script setup lang="ts">
import GuestHeader from '@/components/GuestHeader/GuestHeader.vue';
import PatientHeader from '@/components/PatientHeader/PatientHeader.vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

defineProps<{
  image: string;
}>();

const userStore = useUserStore();
const { isGuest } = storeToRefs(userStore);
</script>

<template>
  <div
    class="row min-h-screen auto-rows-min gap-y-24 bg-white lg:auto-rows-auto"
    data-testpl="layout-info"
  >
    <GuestHeader v-if="isGuest" class="top-0 left-0 z-1 col-span-full w-full lg:absolute" />
    <PatientHeader v-else class="top-0 left-0 z-1 col-span-full w-full lg:absolute" />

    <div class="col-span-full flex justify-center px-16 lg:col-span-6 lg:px-0">
      <figure class="relative h-full w-full max-w-424 before:block before:pt-[100%] lg:max-w-none">
        <img
          class="rounded-4 absolute top-0 left-0 h-full w-full object-cover lg:rounded-none"
          :src="image"
          alt=""
          data-testpl="layout-info-image"
        />
      </figure>
    </div>

    <main
      class="col-span-full px-16 pb-64 lg:col-span-6 lg:-ml-24 lg:px-24 lg:py-112"
      data-testpl="layout-info-content"
    >
      <RouterView />
    </main>
  </div>
</template>
