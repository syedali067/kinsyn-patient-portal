import { apiTerra } from '@/api/integrations/terra/apiTerra';
import IconBeat from '@/assets/icons/beat.svg?component';
import IconDroplet from '@/assets/icons/droplet.svg?component';
import IconFlame from '@/assets/icons/flame.svg?component';
import IconHeartRate from '@/assets/icons/heart-rate.svg?component';
import IconHeart from '@/assets/icons/heart.svg?component';
import IconLung from '@/assets/icons/lung.svg?component';
import IconMoon from '@/assets/icons/moon.svg?component';
import IconProfile from '@/assets/icons/profile.svg?component';
import IconScale from '@/assets/icons/scale.svg?component';
import IconStep from '@/assets/icons/step.svg?component';
import type { TerraMapping } from '@/types/integration';
import { computedAsync } from '@vueuse/core';
import { formatInTimeZone } from 'date-fns-tz';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

export const useTerra = () => {
  const { t } = useI18n();

  const isTerraLoading = ref(false);
  const getTerraEndUserResponse = computedAsync(
    () => apiTerra.getTerraEndUser(),
    null,
    isTerraLoading,
  );

  const terraEndUser = computed(() => {
    return getTerraEndUserResponse.value?.data.value?.data;
  });

  // TODO: fix typing, computed must return TerraMapping[] or string, not 'as TerraMapping[]'
  const terraMapping = computed(() => {
    const terra = terraEndUser.value;

    const formatDuration = (seconds: number) => {
      if (!seconds) return t('notApplicable');
      const isNegative = seconds < 0;
      const absSeconds = Math.abs(seconds);

      const hours = Math.floor(absSeconds / 3600);
      const minutes = Math.floor((absSeconds % 3600) / 60);

      return {
        hours,
        minutes,
        isNegative,
      };
    };

    const dateOutput = (date: string | null | undefined) => {
      return date ? formatInTimeZone(date, 'UTC', 'MMM d') : t('notApplicable');
    };

    const minMaxValue = computed(() => {
      if (!terra?.daily?.minHrBpm && !terra?.daily?.maxHrBpm) {
        return t('notApplicable');
      }
      return (
        (terra?.daily?.minHrBpm ?? t('notApplicable')) +
        '/' +
        (terra?.daily?.maxHrBpm ?? t('notApplicable'))
      );
    });

    return [
      {
        title: t('activities'),
        values: [
          {
            icon: IconStep,
            label: t('steps'),
            value: terra?.daily?.steps ?? t('notApplicable'),
            measurementValue: terra?.daily?.steps ? t('steps') : '',
            date: dateOutput(terra?.daily?.stepsUpdatedAt),
          },
          {
            icon: IconFlame,
            label: t('calories'),
            value: terra?.daily?.totalBurnedCalories ?? t('notApplicable'),
            measurementValue: terra?.daily?.totalBurnedCalories ? 'kcal' : '',
            date: dateOutput(terra?.daily?.totalBurnedCaloriesUpdatedAt),
          },
          {
            icon: IconHeart,
            label: t('dailyExercise'),
            value: terra?.daily?.activitySeconds
              ? formatDuration(terra?.daily?.activitySeconds)
              : t('notApplicable'),
            date: dateOutput(terra?.daily?.activitySecondsUpdatedAt),
          },
        ],
      },
      {
        title: t('body'),
        values: [
          {
            icon: IconScale,
            label: t('weight'),
            value: terra?.body?.weightLb?.toFixed(2) ?? t('notApplicable'),
            measurementValue: terra?.body?.weightLb ? 'lb' : '',
            valueDiffLb: terra?.body?.weightLb ? terra?.body?.weightLbDiff : null,
            date: dateOutput(terra?.body?.weightLbUpdatedAt),
          },
          {
            icon: IconProfile,
            label: t('bmi'),
            value: terra?.body?.bmi?.toFixed(2) ?? t('notApplicable'),
            date: dateOutput(terra?.body?.bmiUpdatedAt),
          },
          {
            icon: IconBeat,
            label: t('bloodPressure'),
            value:
              terra?.body?.bloodPressureDiastolic && terra?.body?.bloodPressureSystolic
                ? `${terra?.body?.bloodPressureDiastolic}/${terra?.body?.bloodPressureSystolic}`
                : t('notApplicable'),
            date: dateOutput(terra?.body?.bloodPressureUpdatedAt),
          },
          {
            icon: IconDroplet,
            label: t('bloodOxygenSpo2'),
            value: terra?.daily?.avgSaturationPercentage ?? t('notApplicable'),
            measurementValue: terra?.daily?.avgSaturationPercentage ? '%' : '',
            date: dateOutput(terra?.daily?.avgSaturationPercentageUpdatedAt),
          },
          {
            icon: IconDroplet,
            label: t('vo2Max'),
            value: terra?.body?.vo2MaxMlPerMinPerKg ?? t('notApplicable'),
            date: dateOutput(terra?.body?.vo2MaxMlPerMinPerKgUpdatedAt),
          },
        ],
      },
      {
        title: t('sleep'),
        values: [
          {
            icon: IconMoon,
            label: t('dailyTotal'),
            value: terra?.sleep?.durationAsleepStateSeconds
              ? formatDuration(terra?.sleep?.durationAsleepStateSeconds)
              : t('notApplicable'),
            valueDiffSleep: terra?.sleep?.durationAsleepStateSecondsAvgDiff
              ? formatDuration(terra?.sleep?.durationAsleepStateSecondsAvgDiff)
              : null,
            date: dateOutput(terra?.sleep?.durationAsleepStateSecondsUpdatedAt),
          },
          {
            icon: IconProfile,
            label: t('score'),
            value: terra?.sleep?.score ?? t('notApplicable'),
            date: dateOutput(terra?.sleep?.scoreUpdatedAt),
          },
          {
            icon: IconLung,
            label: t('respirationRate'),
            value: terra?.sleep?.avgBreathsPerMin ?? t('notApplicable'),
            date: dateOutput(terra?.sleep?.avgBreathsPerMinUpdatedAt),
          },
        ],
      },
      {
        title: t('heart'),
        values: [
          {
            icon: IconHeartRate,
            label: t('avgRestingHr'),
            value: terra?.daily?.restingHrBpm ?? t('notApplicable'),
            measurementValue: terra?.daily?.restingHrBpm ? 'bpm' : '',
            date: dateOutput(terra?.daily?.restingHrBpmUpdatedAt),
          },
          {
            icon: IconBeat,
            label: t('minMax'),
            value: minMaxValue.value,
            measurementValue: terra?.daily?.minHrBpm || terra?.daily?.maxHrBpm ? 'bpm' : '',
            date: dateOutput(terra?.daily?.maxHrBpmUpdatedAt),
          },
          {
            icon: IconHeart,
            label: t('avgHeartRate'),
            value: terra?.daily?.avgHrBpm ?? t('notApplicable'),
            date: dateOutput(terra?.daily?.avgHrBpmUpdatedAt),
          },
          {
            icon: IconHeartRate,
            label: t('heartRateVariability'), // change icon
            value: terra?.daily?.avgHrvRmssd ?? t('notApplicable'),
            date: dateOutput(terra?.daily?.avgHrvRmssdUpdatedAt),
          },
        ],
      },
    ] as TerraMapping[];
  });

  return {
    terraEndUser,
    terraMapping,
    isTerraLoading,
    getTerraEndUserResponse,
  };
};
