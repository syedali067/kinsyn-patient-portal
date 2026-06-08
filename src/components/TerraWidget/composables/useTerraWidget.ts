import { apiTerra } from '@/api/integrations/terra';
import type {
  TerraUserProviderData,
  TerraUserTerraInfoMenstruationPhase,
  TerraUserTerraInfo,
  TerraUserTerraInfoProvider,
} from '@/api/integrations/terra/types';
import IconCharge from '@/assets/icons/charge.svg?component';
import IconHeart from '@/assets/icons/heart.svg?component';
import IconMoon from '@/assets/icons/moon.svg?component';
import IconSun from '@/assets/icons/sun.svg?component';
import mountainImage from '@/assets/images/mountain.jpeg';
import seaImage from '@/assets/images/sea.jpg';
import starskyImage from '@/assets/images/starsky.jpg';
import type {
  TerraWidgetArcProgressSlideData,
  TerraWidgetArcStatsSlideData,
  TerraWidgetCircleProgressSlideData,
  TerraWidgetCycleSlideData,
  TerraWidgetData,
  TerraWidgetSlide,
} from '@/components/TerraWidget/types';
import { useToastStore } from '@/stores/toast';
import {
  formatSecondsToReadableTime,
  stringToSecondaryReadableDateFormat,
  toShortDate,
} from '@/utils/formatters';
import { createSharedComposable } from '@vueuse/core';
import { addDays } from 'date-fns';
import { ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';

export const useTerraWidget = createSharedComposable(() => {
  const toastStore = useToastStore();
  const { t } = useI18n();

  const endUsers = shallowRef<TerraWidgetData[]>([]);

  const getEndUsers = async ({ force = false }: { force?: boolean } = {}) => {
    const response = force
      ? await apiTerra.getTerraEndUser.load()
      : await apiTerra.getTerraEndUser();

    endUsers.value =
      response.data.value?.data?.terraUsers.map((endUser) => ({
        deviceName: endUser.terra.provider,
        terraUserId: endUser.terra.user_id,
        slides: mapSlides(endUser.providerData),
        lastSync: endUser.lastEvent,
      })) ?? [];
  };

  const getDeviceName = (code: TerraUserTerraInfoProvider): string => {
    switch (code) {
      case 'OURA':
        return t('oura');
      case 'GARMIN':
        return t('garmin');
      case 'FITBIT':
        return t('fitbit');
      case 'SAMSUNG':
        return t('samsung');
      case 'APPLE':
        return t('appleWatch');
      case 'WHOOP':
        return t('whoop');
      default:
        return '';
    }
  };

  // Mappers for slides

  // Get summ values for array of numbers, where each number is a percentage of the total sum of the numbers
  const getSummValues = (numbers: number[]) => {
    const total = numbers.reduce((acc, curr) => acc + curr, 0);
    return numbers.map((number) => (number / total) * 100);
  };

  // Readiness
  const getReadinessSlideData = (
    providerData: TerraUserProviderData,
  ): TerraWidgetArcProgressSlideData => ({
    points: providerData.readinessValue ?? 0,
    level: providerData.readinessLevelLabel ?? '',
    caption: providerData.readinessUpdatedAt
      ? `${t('lastUpdatedOn')} ${stringToSecondaryReadableDateFormat(providerData.readinessUpdatedAt)}`
      : '',
  });

  // Stress level
  const getStressSlideData = (
    providerData: TerraUserProviderData,
  ): TerraWidgetCircleProgressSlideData => ({
    points: getSummValues([
      providerData.stressDurationSecondsRest ?? 0,
      providerData.stressDurationSecondsLow ?? 0,
      providerData.stressDurationSecondsMedium ?? 0,
      providerData.stressDurationSecondsHigh ?? 0,
    ]),
    pointsToShow: providerData.stressLevel ?? 0,
    label: providerData.stressLevelLabel ?? '',
    rest: formatSecondsToReadableTime(providerData.stressDurationSecondsRest, true),
    low: formatSecondsToReadableTime(providerData.stressDurationSecondsLow, true),
    medium: formatSecondsToReadableTime(providerData.stressDurationSecondsMedium, true),
    high: formatSecondsToReadableTime(providerData.stressDurationSecondsHigh, true),
  });

  // Sleep
  const getSleepSlideData = (
    providerData: TerraUserProviderData,
  ): TerraWidgetArcStatsSlideData => ({
    points: providerData.sleepScore || providerData.sleepEfficiency || 0,
    title: providerData.sleepScore ? t('sleepScore') : t('sleepEfficiency'),
    caption:
      providerData.sleepDurationTotalSeconds && providerData.sleepDurationUpdatedAt
        ? t('timeOfSleepOnDate', {
            time: formatSecondsToReadableTime(providerData.sleepDurationTotalSeconds),
            date: stringToSecondaryReadableDateFormat(providerData.sleepDurationUpdatedAt),
          })
        : '',
    stats: [
      {
        label: t('awake'),
        value: providerData.sleepDurationAwakeStatePercentage?.toString() ?? '',
        valueSub: '%',
        icon: IconSun,
        additionalValue:
          formatSecondsToReadableTime(providerData.sleepDurationAwakeStateSeconds, true) ?? '',
      },
      {
        label: t('light'),
        value: providerData.sleepDurationLightSleepStatePercentage?.toString() ?? '',
        valueSub: '%',
        icon: IconCharge,
        additionalValue:
          formatSecondsToReadableTime(providerData.sleepDurationLightSleepStateSeconds, true) ?? '',
      },
      {
        label: t('rem'),
        value: providerData.sleepDurationRemSleepStatePercentage?.toString() ?? '',
        valueSub: '%',
        icon: IconHeart,
        additionalValue:
          formatSecondsToReadableTime(providerData.sleepDurationRemSleepStateSeconds, true) ?? '',
      },
      {
        label: t('deep'),
        value: providerData.sleepDurationDeepSleepStatePercentage?.toString() ?? '',
        valueSub: '%',
        icon: IconMoon,
        additionalValue:
          formatSecondsToReadableTime(providerData.sleepDurationDeepSleepStateSeconds, true) ?? '',
      },
    ],
  });

  // Cycle
  const getMenstruationPhaseExplanation = (phase: TerraUserTerraInfoMenstruationPhase) => {
    switch (phase) {
      case 'menstrual':
        return t('menstrualPhaseExplanation');
      case 'follicular':
        return t('follicularPhaseExplanation');
      case 'ovulation':
        return t('ovulationPhaseExplanation');
      case 'luteal':
        return t('lutealPhaseExplanation');
      default:
        return '';
    }
  };

  const getCycleSlideData = (providerData: TerraUserProviderData): TerraWidgetCycleSlideData => ({
    cycleDay: providerData.cycleDay ?? 0,
    cycleLengthDays: providerData.cycleLengthDays ?? 0,
    periodStart: providerData.periodStart ? toShortDate(providerData.periodStart) : '',
    periodEnd: providerData.periodStart
      ? toShortDate(addDays(new Date(providerData.periodStart), providerData.periodLengthDays ?? 0))
      : '',
    menstruationPhase: providerData.menstruationPhase ?? 'unknown',
    menstruationPhaseExplanation: getMenstruationPhaseExplanation(
      providerData.menstruationPhase ?? 'unknown',
    ),
    nextPeriodDay: providerData.nextPeriodDay
      ? `${toShortDate(providerData.nextPeriodDay)} – ${toShortDate(addDays(new Date(providerData.nextPeriodDay), providerData.periodLengthDays ?? 0))}`
      : '',
  });

  const mapSlides = (providerData: TerraUserProviderData): TerraWidgetSlide[] => {
    const slides: TerraWidgetSlide[] = [];

    if (providerData.readinessLevel) {
      slides.push({
        type: 'arc-slide',
        theme: 'dark',
        name: t('readiness'),
        bgImage: mountainImage,
        data: getReadinessSlideData(providerData),
      });
    }

    if (providerData.stressLevel) {
      slides.push({
        type: 'circle-slide',
        theme: 'dark',
        name: t('stressLevel'),
        bgImage: seaImage,
        data: getStressSlideData(providerData),
      });
    }

    if (providerData.sleepEfficiency) {
      slides.push({
        type: 'arc-stats-slide',
        theme: 'dark',
        name: t('sleepTracker'),
        bgImage: starskyImage,
        data: getSleepSlideData(providerData),
      });
    }

    if (providerData.cycleDay) {
      slides.push({
        type: 'cycle-slide',
        theme: 'brown',
        name: t('cycleInsights'),
        data: getCycleSlideData(providerData),
      });
    }

    return slides;
  };

  const disconnectUserLoading = ref(false);
  const disconnectUser = async (terraUserId: TerraUserTerraInfo['user_id']) => {
    try {
      disconnectUserLoading.value = true;

      const { response } = await apiTerra.disconnectUser(terraUserId);

      if (response.value?.status === 200) {
        endUsers.value = endUsers.value.filter((user) => user.terraUserId !== terraUserId);

        toastStore.addToast({
          type: 'success',
          text: t('deviceWasDisconnected'),
        });
      }
    } finally {
      disconnectUserLoading.value = false;
    }
  };

  const syncUserLoading = ref(false);
  const syncUser = async (terraUserId: TerraUserTerraInfo['user_id']) => {
    try {
      syncUserLoading.value = true;
      await apiTerra.syncUser(terraUserId);
    } finally {
      syncUserLoading.value = false;
    }
  };

  return {
    endUsers,

    getEndUsers,
    getDeviceName,

    mapSlides,

    disconnectUser,
    disconnectUserLoading,
    syncUser,
    syncUserLoading,
  };
});
