export type AnalyticsEvent = 'PageView' | 'Checkout Started';

export interface DeviceInfo {
  screen_resolution: string;
  viewport_size: string;
  encoding: string;
  language: string;
  colors: string;
  platform: string;
  user_agent: string;
}

export interface BrowserInfo {
  referrer: string;
  title: string;
  url: string;
}

export interface MarketingInfo {
  fbc: string;
  fbp: string;
}

export interface TrackCheckoutStartedPayload {
  cartId: number;
}

export interface AnalyticsPayload<P = unknown> {
  event: AnalyticsEvent;
  payload: P;
  device: DeviceInfo;
  browser: BrowserInfo;
  marketing: MarketingInfo;
}
