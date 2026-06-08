<script setup lang="ts">
import BaseButton from '../BaseButton/BaseButton.vue';
import BasePopover from '../BasePopover/BasePopover.vue';
import MainLogo from '../MainLogo/MainLogo.vue';
import MenuItem from './components/MenuItem.vue';
import IconCheckCircle from '@/assets/icons/check-circle.svg?component';
import IconClose from '@/assets/icons/close.svg?component';
import IconHamburger from '@/assets/icons/hamburger.svg?component';
import IconLogout from '@/assets/icons/logout.svg?component';
import IconShoppingBag from '@/assets/icons/shopping-bag.svg?component';
import BaseAvatar from '@/components/BaseAvatar/BaseAvatar.vue';
import BaseCounter from '@/components/BaseCounter/BaseCounter.vue';
import ModalConnectDevices from '@/components/ModalConnectDevices/ModalConnectDevices.vue';
import { useConnectDevice } from '@/composables/useConnectDevice';
import { useNavigation } from '@/composables/useNavigation';
import { useShoppingCart } from '@/composables/useShoppingCart';
import { useTerra } from '@/composables/useTerra';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import { ANIMATION_DELAY } from '@/utils/constants';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { useScrollLock } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';

const {
  navigationListPatientMobileMenu,
  navigationListPatientHeader,
  navigationListPatientPopoverMenu,
} = useNavigation();

const { terraEndUser } = useTerra();
const {
  isLoading: isDevicesLoading,
  connectUrl,
  disconnectDevice,
  devices,
  modalConnectDevicesShow,
} = useConnectDevice(terraEndUser.value);

const { toggleShoppingCart } = useShoppingCart();
const cartStore = useCartStore();
const { itemsCount } = storeToRefs(cartStore);

const isCounterShowed = computed(() => itemsCount.value > 0);

const userStore = useUserStore();
const logoutLoading = ref(false);

const isAvatarMenuOpen = ref(false);
const isAvatarMobileMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);
const isLocked = useScrollLock(document.body);
const shouldLockBody = computed(() => isMobileMenuOpen.value || isAvatarMobileMenuOpen.value);

const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');

const onCloseMobileMenu = () => {
  isMobileMenuOpen.value = false;
  isAvatarMobileMenuOpen.value = false;
};

const onOpenAvatarMobileMenu = () => {
  if (isMobileMenuOpen.value) {
    setTimeout(() => {
      isMobileMenuOpen.value = false;
    }, ANIMATION_DELAY);
  }

  isAvatarMobileMenuOpen.value = true;
};

watch(shouldLockBody, (isOpen) => {
  isLocked.value = isOpen;
});

watch(greaterOrEqualLg, (value) => {
  if (value) {
    onCloseMobileMenu();
  }
});
</script>

<template>
  <header
    class="h-header-height lg:h-header-height-lg grid grid-cols-[auto_auto_auto] items-center gap-16 px-16 lg:grid-cols-[1fr_auto_auto] lg:px-32"
    data-testpl="patient-header"
  >
    <span
      class="pointer-events-none absolute inset-0 -z-1 bg-white transition-opacity"
      :class="isMobileMenuOpen || isAvatarMobileMenuOpen ? 'opacity-100' : 'opacity-0'"
    />

    <BasePopover v-if="greaterOrEqualLg" v-model:open="isAvatarMenuOpen">
      <template #trigger>
        <button
          type="button"
          class="w-fit lg:order-3"
          data-testpl="patient-header-open-profile-menu-btn"
        >
          <BaseAvatar :name="userStore.fullName" :src="userStore.avatar" />
        </button>
      </template>

      <template #content>
        <div class="flex w-275 flex-col gap-24 p-8" data-testpl="patient-header-profile-menu">
          <div class="border-stone flex items-center justify-between gap-16 border-b p-16">
            <p class="flex flex-col gap-4">
              <span
                v-if="userStore.fullName"
                class="text-14"
                data-testpl="patient-header-profile-menu-name"
              >
                {{ userStore.fullName }}
              </span>

              <span
                class="text-12 text-secondary-text break-all"
                data-testpl="patient-header-profile-menu-email"
              >
                {{ userStore.email }}
              </span>
            </p>

            <IconCheckCircle class="text-secondary-text size-20" />
          </div>

          <ul data-testpl="patient-header-profile-menu-navigation">
            <li
              v-for="item in navigationListPatientPopoverMenu"
              :key="item.id"
              data-testpl="patient-header-profile-menu-navigation-item"
            >
              <RouterLink
                v-if="item.to"
                :to="item.to"
                class="text-14 hover:bg-bone rounded-4 flex h-48 items-center gap-8 bg-white px-16 py-12 font-medium whitespace-nowrap transition-colors"
                active-class="lg:bg-bone"
                data-testpl="patient-header-profile-menu-navigation-item-link"
                @click="isAvatarMenuOpen = false"
              >
                <component
                  :is="item.icon"
                  class="size-20"
                  data-testpl="patient-header-profile-menu-navigation-item-icon"
                />
                <span
                  class="text-14"
                  data-testpl="patient-header-profile-menu-navigation-item-label"
                >
                  {{ item.label }}
                </span>
                <BaseCounter v-if="item.counter" v-model="item.counter" size="16" class="z-1" />
              </RouterLink>

              <button
                v-else-if="item.action"
                type="button"
                class="text-14 hover:bg-bone rounded-4 flex h-48 w-full items-center gap-8 bg-white px-16 py-12 font-medium whitespace-nowrap transition-colors"
                data-testpl="patient-header-profile-menu-navigation-item-button"
                @click="
                  item.action();
                  isAvatarMenuOpen = false;
                "
              >
                <component
                  :is="item.icon"
                  class="size-20"
                  data-testpl="patient-header-profile-menu-navigation-item-icon"
                />
                <span class="text-14">
                  {{ item.label }}
                </span>
              </button>
            </li>
          </ul>

          <div class="flex flex-col gap-12">
            <!-- TODO: We are currently hiding this until the referral program comes out. -->
            <!-- <BaseButton theme="outline" @click="false"> {{ $t('gift') }} KINSYN </BaseButton> -->

            <BaseButton
              theme="outline"
              href="/actions/users/logout"
              data-testpl="patient-header-profile-menu-logout-btn"
              :loading="logoutLoading"
              @click="logoutLoading = true"
            >
              <template #prepend>
                <IconLogout class="size-20 shrink-0" />
              </template>
              {{ $t('logout') }}
            </BaseButton>
          </div>
        </div>
      </template>
    </BasePopover>

    <template v-else>
      <button
        v-if="!(isMobileMenuOpen || isAvatarMobileMenuOpen)"
        class="text-coal hover:text-beige flex size-40 items-center justify-center transition-colors"
        type="button"
        data-testpl="patient-header-mobile-navigation-open-btn"
        @click="isMobileMenuOpen = true"
      >
        <IconHamburger class="size-40" />
      </button>

      <button
        v-else
        class="text-coal hover:text-beige flex size-40 items-center justify-center transition-colors"
        type="button"
        data-testpl="patient-header-mobile-navigation-close-btn"
        @click="onCloseMobileMenu"
      >
        <IconClose class="size-40" />
      </button>

      <Teleport to="body">
        <Transition
          enter-active-class="animate-[fadeIn_0.2s]"
          leave-active-class="animate-[fadeOut_0.2s]"
        >
          <div
            v-if="isMobileMenuOpen"
            class="fixed inset-x-0 top-64 bottom-0 z-9999 flex h-full flex-col justify-between bg-white px-24 pt-40 pb-88"
            data-testpl="patient-header-mobile-navigation-wrapper"
          >
            <ul
              class="text-21 fond-secondary flex flex-col gap-32 overflow-y-auto"
              data-testpl="patient-header-mobile-navigation-list"
            >
              <li
                v-for="(item, i) in navigationListPatientMobileMenu"
                :key="i"
                data-testpl="patient-header-mobile-navigation-list-item"
              >
                <component
                  v-if="item.to || item.href"
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
                  class="flex items-center gap-8"
                  data-testpl="patient-header-mobile-navigation-list-item-link"
                  @click="isMobileMenuOpen = false"
                >
                  {{ item.label }}
                  <BaseCounter v-if="item.counter" v-model="item.counter" class="z-1" />
                </component>
              </li>
            </ul>

            <!-- TODO: We are currently hiding this until the referral program comes out. -->
            <!-- <BaseButton theme="outline" @click="false"> {{ $t('gift') }} KINSYN </BaseButton> -->
          </div>
        </Transition>
      </Teleport>
    </template>

    <div
      class="flex justify-center lg:order-1 lg:justify-start"
      data-testpl="patient-header-logo-wrapper"
    >
      <MainLogo />
    </div>

    <nav class="lg:order-2" data-testpl="patient-header-navigation">
      <ul
        v-if="greaterOrEqualLg"
        class="flex items-center gap-16"
        data-testpl="patient-header-navigation-list"
      >
        <li
          v-for="item in navigationListPatientHeader"
          :key="item.id"
          :data-testpl="`patient-header-navigation-list-item-${item.id}`"
        >
          <MenuItem :item="item" />
        </li>
      </ul>

      <div v-else class="flex justify-end gap-16" data-testpl="patient-header-mobile-navigation">
        <button
          class="group text-coal relative block size-40 p-8"
          type="button"
          data-testpl="navigation-cart-btn"
          @click="toggleShoppingCart"
        >
          <span
            class="bg-stone/10 absolute top-0 left-0 -z-1 size-40 animate-[zoomOut_0.3s_ease-out_both] rounded-full group-hover:animate-[zoomIn_0.3s_ease-out_both]"
            data-testpl="navigation-cart-btn-hover-bg"
          />

          <IconShoppingBag data-testpl="navigation-cart-icon" />

          <BaseCounter
            v-if="isCounterShowed"
            v-model="itemsCount"
            class="absolute top-0 right-0 z-1"
            size="16"
          />
        </button>

        <button
          type="button"
          class="w-fit lg:order-3"
          data-testpl="patient-header-open-mobile-profile-menu-btn"
          @click="onOpenAvatarMobileMenu"
        >
          <BaseAvatar :name="userStore.fullName" :src="userStore.avatar" />
        </button>

        <Teleport to="body">
          <Transition
            enter-active-class="animate-[fadeIn_0.2s]"
            leave-active-class="animate-[fadeOut_0.2s]"
          >
            <div
              v-if="isAvatarMobileMenuOpen"
              class="fixed inset-x-0 top-64 bottom-0 z-9999 flex h-full flex-col justify-between bg-white p-24 pb-88"
              data-testpl="patient-header-mobile-profile-menu"
            >
              <div class="flex min-h-0 flex-col gap-24">
                <div class="border-stone flex items-center justify-between gap-16 border-b">
                  <div class="flex flex-col gap-4">
                    <p
                      v-if="userStore.fullName"
                      class="text-14"
                      data-testpl="patient-header-mobile-profile-menu-name"
                    >
                      {{ userStore.fullName }}
                    </p>

                    <a
                      class="text-12 text-secondary-text mb-16 break-all"
                      data-testpl="patient-header-mobile-profile-menu-email"
                      :href="`mailto:${userStore.email}`"
                    >
                      {{ userStore.email }}
                    </a>
                  </div>

                  <IconCheckCircle class="text-secondary-text size-20" />
                </div>

                <ul
                  class="text-21 fond-secondary flex flex-col gap-32 overflow-y-auto last:mb-24"
                  data-testpl="patient-header-mobile-profile-menu-navigation"
                >
                  <li
                    v-for="(item, i) in navigationListPatientPopoverMenu"
                    :key="i"
                    data-testpl="patient-header-mobile-profile-menu-navigation-item"
                  >
                    <RouterLink
                      v-if="item.to"
                      :to="item.to"
                      class="flex items-center gap-8"
                      data-testpl="patient-header-mobile-profile-menu-navigation-item-link"
                      @click="isAvatarMobileMenuOpen = false"
                    >
                      {{ item.label }}
                      <BaseCounter v-if="item.counter" v-model="item.counter" class="z-1" />
                    </RouterLink>

                    <button
                      v-else-if="item.action"
                      type="button"
                      class="w-full text-left"
                      data-testpl="patient-header-mobile-profile-menu-navigation-item-button"
                      @click="
                        item.action();
                        isAvatarMobileMenuOpen = false;
                      "
                    >
                      {{ item.label }}
                    </button>
                  </li>
                </ul>
              </div>

              <BaseButton
                theme="outline"
                href="/actions/users/logout"
                class="shrink-0"
                data-testpl="patient-header-mobile-profile-menu-logout-btn"
                :loading="logoutLoading"
                @click="logoutLoading = true"
              >
                <template #prepend>
                  <IconLogout class="size-20 shrink-0" />
                </template>
                {{ $t('logout') }}
              </BaseButton>
            </div>
          </Transition>
        </Teleport>
      </div>
    </nav>

    <ModalConnectDevices
      v-model="modalConnectDevicesShow"
      :devices
      :loading="isDevicesLoading"
      @connect="connectUrl"
      @disconnect="disconnectDevice"
    />
  </header>
</template>
