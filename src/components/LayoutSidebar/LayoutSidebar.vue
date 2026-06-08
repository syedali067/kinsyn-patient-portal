<script setup lang="ts">
import { releaseFlags } from '@/config/releaseFlags';
import type { NavigationItem } from '@/types/navigation.ts';
import { RouterLink } from 'vue-router';

withDefaults(
  defineProps<{
    navigation?: NavigationItem[];
  }>(),
  {
    navigation: () => [],
  },
);

const { sidebarBackdropEnabled } = releaseFlags;
</script>

<template>
  <aside
    class="group m-24 mt-76 flex flex-col items-center overflow-auto"
    data-testpl="layout-sidebar"
  >
    <div
      v-if="sidebarBackdropEnabled"
      class="bg-coal/35 pointer-events-none fixed inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    />

    <ul class="group relative flex flex-col gap-20" data-testpl="layout-sidebar-list">
      <li v-for="item in navigation" :key="item.id" data-testpl="layout-sidebar-list-item">
        <component
          :is="item.to ? RouterLink : 'a'"
          v-bind="
            item.to
              ? {
                  to: item.to,
                }
              : {
                  href: item.href,
                }
          "
          :data-onboarding-step="item.id"
          class="rounded-6 lg:hover:bg-stone block h-48 items-center bg-white whitespace-nowrap transition-all lg:hover:text-white"
          active-class="lg:bg-stone lg:text-white"
          data-testpl="layout-sidebar-list-item-component"
        >
          <span
            v-if="item.icon"
            class="rounded-12 flex items-center justify-center gap-8 p-8"
            :class="{
              'pr-0': sidebarBackdropEnabled,
            }"
            data-testpl="layout-sidebar-list-item-wrapper"
            :title="!sidebarBackdropEnabled ? item.label : ''"
          >
            <component
              :is="item.icon"
              class="size-32 shrink-0"
              data-testpl="layout-sidebar-list-item-icon"
            />

            <span
              v-if="item.label && sidebarBackdropEnabled"
              class="text-12 w-0 overflow-hidden font-medium uppercase transition-[width] duration-300 will-change-[width] group-hover:w-150"
              data-testpl="layout-sidebar-list-item-label"
            >
              {{ item.label }}
            </span>
          </span>
        </component>
      </li>
    </ul>
  </aside>
</template>
