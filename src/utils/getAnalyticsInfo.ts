import type { BrowserInfo, DeviceInfo, MarketingInfo } from '@/api/analytics/types';

export const getDeviceInfo = (): DeviceInfo => {
  const { width: screenWidth, height: screenHeight, colorDepth } = window.screen;
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  return {
    screen_resolution: `${screenWidth}x${screenHeight}`,
    viewport_size: `${viewportWidth}x${viewportHeight}`,
    encoding: document.characterSet,
    language: navigator.language.toLowerCase(),
    colors: `${colorDepth}-bit`,
    platform: navigator.platform,
    user_agent: navigator.userAgent,
  };
};

export const getBrowserInfo = (): BrowserInfo => {
  return {
    referrer: document.referrer,
    title: document.title,
    url: window.location.href,
  };
};

export const getMarketingInfo = (): MarketingInfo => {
  return {
    fbc: localStorage.getItem('fbc') || '',
    fbp: localStorage.getItem('fbp') || '',
  };
};
