import type { AnalyticsPayload, TrackCheckoutStartedPayload } from './types';
import { useApi } from '@/composables/useApi';
import type { Response } from '@/types/response';
import { getBrowserInfo, getDeviceInfo, getMarketingInfo } from '@/utils/getAnalyticsInfo';
import type { RouteMeta } from 'vue-router';

const trackPageView = (meta: RouteMeta) => {
  const browser = getBrowserInfo();
  if (meta.title) {
    browser.title = meta.title;
  }

  return useApi<Response<void>>('/api/v1/track', {
    toastOptions: { displayError: false },
  }).post({
    event: 'PageView',
    payload: {},
    device: getDeviceInfo(),
    browser,
    marketing: getMarketingInfo(),
  } satisfies AnalyticsPayload);
};

const trackCheckoutStarted = (payload: TrackCheckoutStartedPayload) => {
  return useApi<Response<void>>('/api/v1/track', {
    toastOptions: { displayError: false },
  }).post({
    event: 'Checkout Started',
    payload,
    device: getDeviceInfo(),
    browser: getBrowserInfo(),
    marketing: getMarketingInfo(),
  } satisfies AnalyticsPayload<TrackCheckoutStartedPayload>);
};

export const apiAnalytics = {
  trackPageView,
  trackCheckoutStarted,
};
