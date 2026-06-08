export interface TerraEndUser {
  referenceId: string;
  terraUsers: TerraUser[];
  recoveryLevel?: number | null;
  sleep?: TerraSleep;
  daily?: TerraDaily;
  body?: TerraBody;
}

export interface AuthWidgetUrl {
  url: string;
}

export interface TerraDaily {
  steps: number | null;
  totalBurnedCalories: number | null;
  activitySeconds: number | null;
  restingHrBpm: number | null;
  minHrBpm: number | null;
  maxHrBpm: number | null;
  stepsUpdatedAt: string | null;
  totalBurnedCaloriesUpdatedAt: string | null;
  activitySecondsUpdatedAt: string | null;
  restingHrBpmUpdatedAt: string | null;
  minHrBpmUpdatedAt: string | null;
  maxHrBpmUpdatedAt: string | null;
  avgSaturationPercentage: number | null;
  avgSaturationPercentageUpdatedAt: string | null;
  avgHrBpm: number | null;
  avgHrBpmUpdatedAt: string | null;
  avgHrvRmssd: number | null;
  avgHrvRmssdUpdatedAt: string | null;
}

export interface TerraBody {
  weightLb: number | null;
  weightLbDiff: number | null;
  bmi: number | null;
  weightLbUpdatedAt: string | null;
  bmiUpdatedAt: string | null;
  bloodPressureDiastolic: number | null;
  bloodPressureSystolic: number | null;
  bloodPressureUpdatedAt: string | null;
  vo2MaxMlPerMinPerKg: number | null;
  vo2MaxMlPerMinPerKgUpdatedAt: string | null;
}

export interface TerraSleep {
  readinessValue: number | null;
  recoveryLevelLabel: string | null;
  durationAsleepStateSeconds: number | null;
  durationAsleepStateSecondsUpdatedAt: string | null;
  durationAsleepStateSecondsAvgDiff: number | null;
  score: number | null;
  scoreUpdatedAt: string | null;
  avgBreathsPerMin: number | null;
  avgBreathsPerMinUpdatedAt: string | null;
}

export interface TerraUser {
  id: string;
  active: boolean;
  terra: TerraUserTerraInfo;
  providerData: TerraUserProviderData;
  lastEvent: string | null;
}

export type TerraUserTerraInfoProvider =
  | 'OURA'
  | 'GARMIN'
  | 'FITBIT'
  | 'SAMSUNG'
  | 'APPLE'
  | 'WHOOP';

export type TerraUserTerraInfoMenstruationPhase =
  | 'menstrual'
  | 'follicular'
  | 'ovulation'
  | 'luteal'
  | 'unknown';

export interface TerraUserTerraInfo {
  created_at: string | null;
  provider: TerraUserTerraInfoProvider;
  scopes: string;
  active: boolean;
  user_id: string;
  reference_id: string;
  last_webhook_update: string | null;
}

export interface TerraUserProviderData {
  // Readiness
  readinessValue: number | null;
  readinessLevel: number | null;
  readinessLevelLabel: string | null;
  readinessUpdatedAt: string | null;

  // Stress
  stressScore: number | null;
  stressScoreUpdatedAt: string | null;
  stressLevel: number | null;
  stressLevelLabel: string | null;
  stressLevelUpdatedAt: string | null;
  stressDurationSecondsRest: number | null;
  stressDurationSecondsRestUpdatedAt: string | null;
  stressDurationSecondsLow: number | null;
  stressDurationSecondsLowUpdatedAt: string | null;
  stressDurationSecondsMedium: number | null;
  stressDurationSecondsMediumUpdatedAt: string | null;
  stressDurationSecondsHigh: number | null;
  stressDurationSecondsHighUpdatedAt: string | null;

  // Cycle
  cycleDay: number | null;
  cycleDayUpdatedAt: string | null;
  periodStart: string | null;
  periodStartUpdatedAt: string | null;
  periodLengthDays: number | null;
  periodLengthDaysUpdatedAt: string | null;
  cycleLengthDays: number | null;
  cycleLengthDaysUpdatedAt: string | null;
  menstruationPhase: TerraUserTerraInfoMenstruationPhase | null;
  menstruationPhaseUpdatedAt: string | null;
  nextPeriodDay: string | null;

  // Sleep
  sleepEfficiency: number | null;
  sleepScore: number | null; // TODO: remove this field, it's not used
  sleepTemperatureDeltaHistory: SleepTemperatureDeltaHistory[];
  sleepDurationAwakeStateSeconds: number | null;
  sleepDurationAwakeStatePercentage: number | null;
  sleepDurationLightSleepStateSeconds: number | null;
  sleepDurationLightSleepStatePercentage: number | null;
  sleepDurationRemSleepStateSeconds: number | null;
  sleepDurationRemSleepStatePercentage: number | null;
  sleepDurationDeepSleepStateSeconds: number | null;
  sleepDurationDeepSleepStatePercentage: number | null;
  sleepDurationTotalSeconds: number | null;
  sleepDurationUpdatedAt: string | null;
}

export interface SleepTemperatureDeltaHistory {
  deltaFahrenheit: number;
  datetime: string;
}
