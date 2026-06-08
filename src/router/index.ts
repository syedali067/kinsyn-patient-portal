import { apiAnalytics } from '@/api/analytics';
import ImageLogin from '@/assets/images/bg-login.jpg';
import { usePostHog } from '@/composables/usePostHog';
import LayoutClean from '@/layouts/LayoutClean/LayoutClean.vue';
import LayoutInfo from '@/layouts/LayoutInfo/LayoutInfo.vue';
import LayoutLogin from '@/layouts/LayoutLogin/LayoutLogin.vue';
import LayoutPatient from '@/layouts/LayoutPatient/LayoutPatient.vue';
import { useUserStore } from '@/stores/user';
import type { SessionUserRole } from '@/types/user';
import { type Component } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    }
    return { top: 0 };
  },
  routes: [
    // Login
    {
      path: '/',
      redirect: { name: 'Login' },
    },
    {
      name: 'Login',
      path: '/login/:type?',
      component: () => import('@/pages/PageLogin/PageLogin.vue'),
      meta: {
        layout: LayoutLogin,
        layoutProps: {
          image: ImageLogin,
        },
        title: 'login',
        permissions: {
          roles: ['guest'],
        },
      },
    },
    {
      name: 'SignUp',
      path: '/sign-up',
      component: () => import('@/pages/PageSignUp/PageSignUp.vue'),
      meta: {
        layout: LayoutLogin,
        layoutProps: {
          image: ImageLogin,
        },
        title: 'signUp',
        permissions: {
          roles: ['guest'],
        },
      },
    },

    // Pages shared by all permissions
    {
      name: 'Checkout',
      path: '/checkout/:type?',
      component: () => import('@/pages/PageCheckout/PageCheckout.vue'),
      meta: {
        layoutSet: {
          guest: LayoutClean,
          default: LayoutPatient,
        },
        title: 'checkout',
        permissions: {
          roles: ['guest', 'patients'],
        },
      },
    },

    // Patient
    {
      name: 'Cart',
      path: '/cart',
      component: () => import('@/pages/PageCart/PageCart.vue'),
      meta: {
        layout: LayoutPatient,
        title: 'cart',
        permissions: {
          roles: ['patients'],
        },
      },
    },
    {
      name: 'PatientHealth',
      path: '/',
      component: () => import('@/pages/PagePatientHealth/PagePatientHealth.vue'),
      meta: {
        layout: LayoutPatient,
        title: 'myHealth',
        permissions: {
          roles: ['patients'],
        },
      },
    },

    // TODO: It was decided not to use the Dashboard page, but not to delete it either
    // {
    //   name: 'PatientDashboard',
    //   path: '/',
    //   component: () => import('@/pages/PagePatientDashboard/PagePatientDashboard.vue'),
    //   meta: {
    //     layout: LayoutPatient,
    //     title: 'dashboard',
    //     permissions: {
    //       roles: ['patients'],
    //     },
    //   },
    // },

    // INFO: Temporary redirect to the Health page (Main page) before MVP release
    {
      name: 'PatientProgress',
      path: '/progress',
      // component: () => import('@/pages/PagePatientProgress/PagePatientProgress.vue'),
      // meta: {
      //   layout: LayoutPatient,
      //   title: 'progress',
      //   permissions: {
      //     roles: ['patients'],
      //   },
      // },
      redirect: { name: 'PatientHealth' },
    },
    {
      name: 'PatientTreatments',
      path: '/treatments',
      component: () => import('@/pages/PagePatientTreatments/PagePatientTreatments.vue'),
      meta: {
        layout: LayoutPatient,
        title: 'treatments',
        permissions: {
          roles: ['patients'],
        },
      },
    },
    {
      name: 'PatientCategoryBiomarkers',
      path: '/category/:categorySlug',
      component: () =>
        import('@/pages/PagePatientCategoryBiomarkers/PagePatientCategoryBiomarkers.vue'),
      meta: {
        layout: LayoutPatient,
        title: 'categoryDetail',
        permissions: {
          roles: ['patients'],
        },
      },
    },
    {
      name: 'PatientMessages',
      path: '/messages/:category?/:chatId?',
      component: () => import('@/pages/PagePatientMessages/PagePatientMessages.vue'),
      meta: {
        layout: LayoutPatient,
        layoutProps: {
          fullHeight: true,
        },
        title: 'messages',
        permissions: {
          roles: ['patients'],
        },
      },
    },
    {
      name: 'PatientPharmacy',
      path: '/pharmacy',
      component: () => import('@/pages/PagePatientPharmacy/PharmacyHome.vue'),
      meta: {
        layout: LayoutPatient,
        title: 'pharmacy',
        permissions: {
          roles: ['patients'],
        },
      },
    },
    {
      name: 'PatientPharmacyCategory',
      path: '/pharmacy/category/:categorySlug',
      component: () => import('@/pages/PagePatientPharmacy/PharmacyCategory.vue'),
      meta: {
        layout: LayoutPatient,
        title: 'productCategory',
        permissions: {
          roles: ['patients'],
        },
      },
    },

    // Patient profile pages
    {
      name: 'PatientAccount',
      path: '/account',
      component: () => import('@/pages/PagePatientAccount/PagePatientAccount.vue'),
      meta: {
        layout: LayoutPatient,
        title: 'myAccount',
        permissions: {
          roles: ['patients'],
        },
      },
    },
    {
      name: 'PatientOrderHistory',
      path: '/orders',
      component: () => import('@/pages/PagePatientOrderHistory/PagePatientOrderHistory.vue'),
      meta: {
        layout: LayoutPatient,
        layoutProps: {
          headerGradient: false,
        },
        title: 'orderHistory',
        permissions: {
          roles: ['patients'],
        },
      },
    },

    // Toast
    {
      name: 'RedirectToast',
      path: '/redirect-toast/:type',
      component: () => import('@/pages/PageRedirectToast/PageRedirectToast.vue'),
    },

    // 404
    {
      name: 'NotFound',
      path: '/:pathMatch(.*)*',
      component: () => import('@/pages/PageNotFound/PageNotFound.vue'),
      meta: {
        layout: LayoutInfo,
        layoutProps: {
          image: ImageLogin,
        },
        title: 'pageNotFound',
      },
    },

    // Thank you page
    {
      name: 'ThankYou',
      path: '/thank-you',
      component: () => import('@/pages/PageThankYou/PageThankYou.vue'),
      meta: {
        layout: LayoutInfo,
        layoutProps: {
          image: ImageLogin,
        },
        title: 'thankYou',
      },
    },
  ],
});

router.beforeEach(async (to) => {
  const userStore = useUserStore();

  await userStore.getSessionInfo();

  const userRole = userStore.role;

  // Check if "to" has only guest permission
  const hasOnlyGuestPermission =
    to.meta.permissions?.roles?.length === 1 && to.meta.permissions.roles.includes('guest');

  if (hasOnlyGuestPermission && !userStore.isGuest) {
    const route = userStore.redirectRoute;

    if (typeof route === 'string') {
      window.location.href = route;
      return false;
    } else if (route) {
      return route;
    }
  }

  // Base checking for permissions
  if (to.meta.permissions?.roles) {
    const hasPermission = to.meta.permissions.roles.includes(userRole);

    if (!hasPermission) {
      return { name: 'Login', query: { forward: `/portal${to.path}` } };
    }
  }

  // Setting up layout if it's an set of layouts (LayoutSet type)
  if (to.meta.layoutSet && Object.keys(to.meta.layoutSet).length > 0) {
    to.meta.layout = to.meta.layoutSet[userRole] || to.meta.layoutSet.default;
  }
});

router.afterEach((to) => {
  apiAnalytics.trackPageView(to.meta);
});

usePostHog();

export default router;

type LayoutSet = { default: Component } & Partial<Record<SessionUserRole, Component>>;

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    permissions?: {
      roles: SessionUserRole[];
    };
    layout?: Component;
    layoutSet?: LayoutSet;
    layoutProps?: Record<string, string | boolean>;
  }
}
