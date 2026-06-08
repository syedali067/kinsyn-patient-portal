import type {
  TerraUser,
  TerraUserTerraInfo,
  TerraUserTerraInfoMenstruationPhase,
  TerraUserTerraInfoProvider,
} from '@/api/integrations/terra/types';
import type { FunctionalComponent } from 'vue';

export type TerraWidgetSlideTheme = 'dark' | 'light' | 'brown';

export type TerraWidgetSlideType =
  | 'arc-slide'
  | 'circle-slide'
  | 'arc-stats-slide'
  | 'stat-slide'
  | 'cycle-slide';

export interface TerraWidgetSlideBase {
  name: string;
  theme: TerraWidgetSlideTheme;
  type: TerraWidgetSlideType;
  bgImage?: string;
}

export interface TerraWidgetMainArcSlide extends TerraWidgetSlideBase {
  type: 'arc-slide';
  theme: 'dark';
  data: TerraWidgetArcProgressSlideData;
}

export interface TerraWidgetMainCircleSlide extends TerraWidgetSlideBase {
  type: 'circle-slide';
  theme: 'dark';
  data: TerraWidgetCircleProgressSlideData;
}

export interface TerraWidgetArcStatsSlide extends TerraWidgetSlideBase {
  type: 'arc-stats-slide';
  theme: 'dark';
  data: TerraWidgetArcStatsSlideData;
}

export interface TerraWidgetStatSlide extends TerraWidgetSlideBase {
  type: 'stat-slide';
  theme: 'light';
  data: TerraWidgetStatSlideData;
}

export interface TerraWidgetCycleSlide extends TerraWidgetSlideBase {
  type: 'cycle-slide';
  theme: 'brown';
  data: TerraWidgetCycleSlideData;
}

export type TerraWidgetSlide =
  | TerraWidgetMainArcSlide
  | TerraWidgetMainCircleSlide
  | TerraWidgetArcStatsSlide
  | TerraWidgetStatSlide
  | TerraWidgetCycleSlide;

export interface TerraWidgetArcProgressSlideData {
  points: number;
  level?: string;
  title?: string;
  caption?: string;
}

export interface TerraWidgetCircleProgressSlideData {
  points: number[];
  pointsToShow?: number;
  label?: string;
  caption?: string;
  rest?: string;
  low?: string;
  medium?: string;
  high?: string;
}

export interface TerraWidgetArcStatsSlideData {
  points: number;
  stats: TerraWidgetStatItem[];
  title?: string;
  caption?: string;
}

export interface TerraWidgetStatSlideData {
  stats: TerraWidgetStatItem[];
}

export interface TerraWidgetCycleSlideData {
  cycleDay: number;
  cycleLengthDays: number;
  periodStart: string;
  periodEnd: string;
  menstruationPhase: TerraUserTerraInfoMenstruationPhase;
  menstruationPhaseExplanation: string;
  nextPeriodDay: string;
}

export interface TerraWidgetStatItem {
  label: string;
  icon: FunctionalComponent;
  value?: string;
  valueSub?: string;
  additionalValue?: string;
}

export interface TerraWidgetData {
  deviceName: TerraUserTerraInfoProvider;
  terraUserId: TerraUser['terra']['user_id'];
  slides: TerraWidgetSlide[];
  lastSync: TerraUserTerraInfo['last_webhook_update'];
}
