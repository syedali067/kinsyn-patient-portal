import posthog from 'posthog-js';

let isPostHogInitialized = false;

export const usePostHog = () => {
  if (import.meta.env.VITE_POSTHOG_API_KEY && !isPostHogInitialized) {
    posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
      api_host: 'https://us.i.posthog.com',
      defaults: '2025-05-24',
    });
    isPostHogInitialized = true;
  }

  return { posthog };
};
