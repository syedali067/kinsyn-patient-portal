import { apiUser } from '@/api/user';
import '@/assets/css/onboarding.css';
import ImageHelp from '@/assets/images/onboarding/help.jpg';
import ImageMessages from '@/assets/images/onboarding/messages.jpg';
import ImageMyHealth from '@/assets/images/onboarding/my-health.jpg';
import ImagePharmacy from '@/assets/images/onboarding/pharmacy.jpg';
import ImageTreatments from '@/assets/images/onboarding/treatments.jpg';
import { useUserStore } from '@/stores/user';
import { createSharedComposable } from '@vueuse/core';
import introJs from 'intro.js';
import type { TourStep } from 'intro.js/src/packages/tour/steps';
import { storeToRefs } from 'pinia';
import { computed, nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const ONBOARDING_STEP_SELECTORS: Record<string, string> = {
  myHealth: '[data-onboarding-step="myHealth"]',
  treatments: '[data-onboarding-step="treatments"]',
  messages: '[data-onboarding-step="messages"]',
  pharmacy: '[data-onboarding-step="pharmacy"]',
  help: '[data-onboarding-step="help"]',
};

interface OnboardingStep extends TourStep {
  image: string;
}

const APP_SCROLL_LOCK_CLASSNAME = 'app-no-scroll';

const getCustomTooltipHtml = (
  image: OnboardingStep['image'],
  title: OnboardingStep['title'],
  intro: OnboardingStep['intro'],
) => {
  return `
    <div class="custom-tooltip-image-container">
      <img src="${image || ''}" alt="${title || ''}" draggable="false" class="custom-tooltip-image">
    </div>

    <h3 class="custom-tooltip-title">${title || ''}</h3>

    <p class="custom-tooltip-text">${intro || ''}</p>
  `;
};

const disableAppScroll = () => document.body.classList.add(APP_SCROLL_LOCK_CLASSNAME);
const enableAppScroll = () => document.body.classList.remove(APP_SCROLL_LOCK_CLASSNAME);

export const useOnboarding = createSharedComposable(() => {
  const userStore = useUserStore();
  const { profile, isPatient } = storeToRefs(userStore);
  const route = useRoute();
  const { t } = useI18n();
  const intro = ref<ReturnType<typeof introJs.tour>>();
  const isOnboardingStarted = ref(false);
  const isOnboardingInited = ref(false);

  const steps: Partial<OnboardingStep>[] = [
    {
      element: ONBOARDING_STEP_SELECTORS.myHealth,
      intro: getCustomTooltipHtml(ImageMyHealth, t('myHealth'), t('onboardingMyHealthDescription')),
      position: 'right',
    },
    {
      element: ONBOARDING_STEP_SELECTORS.treatments,
      intro: getCustomTooltipHtml(
        ImageTreatments,
        t('treatments'),
        t('onboardingTreatmentsDescription'),
      ),
      position: 'right',
    },
    {
      element: ONBOARDING_STEP_SELECTORS.pharmacy,
      intro: getCustomTooltipHtml(ImagePharmacy, t('pharmacy'), t('onboardingPharmacyDescription')),
      position: 'right',
    },
    {
      element: ONBOARDING_STEP_SELECTORS.help,
      intro: getCustomTooltipHtml(ImageHelp, t('help'), t('onboardingHelpDescription')),
      position: 'right',
    },
    {
      element: ONBOARDING_STEP_SELECTORS.messages,
      intro: getCustomTooltipHtml(ImageMessages, t('messages'), t('onboardingMessagesDescription')),
      position: 'bottom',
    },
  ];

  const completeOnboarding = async () => {
    const response = await apiUser.completeOnboarding();

    if (response.statusCode.value === 200 && profile.value) {
      profile.value.hasCompletedOnboarding = true;
    }
  };

  const applyCustomTooltip = () => {
    const tooltip = document.querySelector('.introjs-tooltip');

    if (!tooltip) {
      return;
    }

    const stepNumber = intro.value?.getCurrentStep() ?? 0;
    const step = steps[stepNumber];

    if (!step) {
      return;
    }

    const tooltipTitle = tooltip.querySelector('.introjs-tooltip-title');
    const buttonsContainer = tooltip.querySelector('.introjs-tooltipbuttons');

    // Remove title
    tooltipTitle?.remove();

    // Move skip button in the footer
    if (buttonsContainer) {
      const skipButton = tooltip.querySelector('.introjs-skipbutton') as HTMLElement | null;

      if (skipButton && skipButton.parentElement !== buttonsContainer) {
        buttonsContainer.insertBefore(skipButton, buttonsContainer.firstChild);
        skipButton.style.display = '';
        skipButton.classList.add('introjs-button');
        skipButton.onclick = () => {
          intro.value?.exit();
        };
      }
    }

    // Hide skip button in footer if last step
    if (intro.value?.isLastStep()) {
      const skipButton = tooltip.querySelector('.introjs-skipbutton') as HTMLElement | null;

      if (skipButton) {
        skipButton.style.display = 'none';
      }
    }
  };

  const customizeTooltip = () => {
    const helperLayer = document.querySelector('.introjs-helperLayer');
    let done = false;
    const runCustomize = () => {
      if (done) return;
      done = true;
      applyCustomTooltip();
    };

    if (helperLayer) {
      helperLayer.addEventListener('transitionend', runCustomize, {
        once: true,
      });
    } else {
      // Fallback for when helperLayer is not found (at first render)
      requestAnimationFrame(() => requestAnimationFrame(runCustomize));
    }
  };

  const onboardingInit = () => {
    intro.value = introJs.tour();

    intro.value.setOptions({
      steps,
      hidePrev: true,
      showBullets: true,
      exitOnOverlayClick: true,
      exitOnEsc: true,
      nextLabel: t('next'),
      skipLabel: t('skip'),
      doneLabel: t('gotIt'),
      scrollTo: 'element',
      tooltipRenderAsHtml: true,
    });

    intro.value.onStart(() => {
      disableAppScroll();
    });

    intro.value.onAfterChange(() => {
      customizeTooltip();
    });

    intro.value.onExit(() => {
      enableAppScroll();
    });

    intro.value.onComplete(() => {
      completeOnboarding();
      enableAppScroll();
    });

    isOnboardingInited.value = true;
  };

  const startTour = async () => {
    if (isOnboardingStarted.value) {
      return;
    }

    await nextTick();

    if (isOnboardingInited.value && intro.value) {
      intro.value.start();
    } else {
      console.warn('IntroJs is not inited yet');
    }
  };

  const shouldShowOnboarding = computed(() => {
    return isPatient.value && !profile.value?.hasCompletedOnboarding && route.name !== 'Checkout';
  });

  return {
    onboardingInit,
    startTour,
    shouldShowOnboarding,
    completeOnboarding,
    isOnboardingStarted,
    isOnboardingInited,
  };
});
