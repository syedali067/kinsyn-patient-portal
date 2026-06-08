export type BaseChartType = 'line' | 'line-indexed' | 'stacked-bar';
export type BaseChartDateFormat = 'day' | 'weekday' | 'month';
export type BaseChartCurve = 'curveBumpX' | 'curveLinear' | 'curveCatmullRom';

export interface BaseChartItem {
  date: Date | string;
  [key: string]: number | string | Date;
}

export interface BaseChartItemWithDate extends BaseChartItem {
  date: Date;
  [key: string]: number | Date;
}
