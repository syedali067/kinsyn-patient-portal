import IconConnect from '@/assets/icons/connect.svg?component';
import IconHelp from '@/assets/icons/help.svg?component';
import IconMessages from '@/assets/icons/messages.svg?component';
import IconMonitor from '@/assets/icons/monitor.svg?component';
import IconOrder from '@/assets/icons/order.svg?component';
import IconPharmacy from '@/assets/icons/pharmacy.svg?component';
import IconProfile from '@/assets/icons/profile.svg?component';
// import IconProgress from '@/assets/icons/progress.svg?component';
import IconShoppingBag from '@/assets/icons/shopping-bag.svg?component';
import IconTreatments from '@/assets/icons/treatments.svg?component';
import { openConnectDeviceModal } from '@/composables/useConnectDevice';
import { useShoppingCart } from '@/composables/useShoppingCart.ts';
import { FAQ_LINK } from '@/constants/links';
import { useCartStore } from '@/stores/cart';
import { useChatsStore } from '@/stores/chats';
import type { NavigationItem } from '@/types/navigation.ts';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export const useNavigation = () => {
  const { t } = useI18n();

  const chatsStore = useChatsStore();
  const cartStore = useCartStore();

  const { toggleShoppingCart } = useShoppingCart();
  const { itemsCount: cartItemsCount } = storeToRefs(cartStore);

  const navigationListPatientSidebar = computed<NavigationItem[]>(() => {
    return [
      // TODO: It was decided not to use the Dashboard page, but not to delete it either
      // {
      //   id: 'dashboard',
      //   label: t('dashboard'),
      //   to: { name: 'PatientDashboard' },
      //   icon: IconDashboard,
      // },
      {
        id: 'myHealth',
        label: t('myHealth'),
        to: { name: 'PatientHealth' },
        icon: IconMonitor,
      },
      // INFO: Temporary redirect to the Health page (Main page) before MVP release
      // {
      //   id: 'myProgress',
      //   label: t('myProgress'),
      //   to: { name: 'PatientProgress' },
      //   icon: IconProgress,
      // },
      {
        id: 'treatments',
        label: t('treatments'),
        to: { name: 'PatientTreatments' },
        icon: IconTreatments,
      },
      {
        id: 'pharmacy',
        label: t('pharmacy'),
        to: { name: 'PatientPharmacy' },
        icon: IconPharmacy,
      },
      {
        id: 'help',
        label: t('help'),
        href: FAQ_LINK,
        icon: IconHelp,
      },
    ];
  });

  const navigationListPatientMobileMenu = computed<NavigationItem[]>(() => {
    return [
      // TODO: It was decided not to use the Dashboard page, but not to delete it either
      // {
      //   id: 'dashboard',
      //   label: t('dashboard'),
      //   to: { name: 'PatientDashboard' },
      // },
      {
        id: 'myHealth',
        label: t('myHealth'),
        to: { name: 'PatientHealth' },
      },
      {
        id: 'messages',
        label: t('messages'),
        to: { name: 'PatientMessages' },
        counter: chatsStore.unreadChatMessages,
      },
      // INFO: Temporary redirect to the Health page (Main page) before MVP release
      // {
      //   id: 'myProgress',
      //   label: t('myProgress'),
      //   to: { name: 'PatientProgress' },
      // },
      {
        id: 'treatments',
        label: t('treatments'),
        to: { name: 'PatientTreatments' },
      },
      {
        id: 'pharmacy',
        label: t('pharmacy'),
        to: { name: 'PatientPharmacy' },
      },
      {
        id: 'help',
        label: t('help'),
        href: FAQ_LINK,
      },
    ];
  });

  const navigationListPatientHeader = computed<NavigationItem[]>(() => {
    return [
      {
        id: 'messages',
        to: { name: 'PatientMessages' },
        icon: IconMessages,
        counter: chatsStore.unreadChatMessages,
      },
      {
        id: 'shoppingCart',
        action: toggleShoppingCart,
        icon: IconShoppingBag,
        counter: cartItemsCount.value,
      },
    ];
  });

  const navigationListPatientPopoverMenu = computed<NavigationItem[]>(() => {
    return [
      {
        id: 'myAccount',
        label: t('myAccount'),
        to: { name: 'PatientAccount' },
        icon: IconProfile,
      },
      {
        id: 'shoppingCart',
        label: t('shoppingCart'),
        to: { name: 'Cart' },
        icon: IconShoppingBag,
        counter: cartItemsCount.value,
      },
      {
        id: 'orderHistory',
        label: t('orderHistory'),
        to: { name: 'PatientOrderHistory' },
        icon: IconOrder,
      },
      {
        id: 'connectADevice',
        label: t('connectADevice'),
        action: openConnectDeviceModal,
        icon: IconConnect,
      },
    ];
  });

  return {
    navigationListPatientSidebar,
    navigationListPatientMobileMenu,
    navigationListPatientHeader,
    navigationListPatientPopoverMenu,
  };
};
