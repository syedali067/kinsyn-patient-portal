import gsap from 'gsap';
import { nextTick } from 'vue';

export const duration = 400;
export const durationInSeconds = duration / 1000;
const ease = 'power2.out';

export const waitTransition = (customDuration = duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, customDuration);
  });
};

export const pageInTransition = async () => {
  window.scrollTo(0, 0);
  await nextTick();
  return fadeInUp('[data-page-in="fadeInUp"]');
};

export const pageOutTransition = async () => {
  await nextTick();
  return fadeOutUp('[data-page-out="fadeOutUp"]');
};

export const loaderInTransition = async () => {
  await nextTick();
  return fadeIn('[data-loader-in="fadeIn"]');
};

export const fadeIn = (selector: string) => {
  const items = document.querySelectorAll(selector);
  if (items.length === 0) return;

  return gsap.fromTo(
    items,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: durationInSeconds,
      ease,
    },
  );
};

export const fadeInUp = (selector: string) => {
  const items = document.querySelectorAll(selector);
  if (items.length === 0) return;

  return gsap.fromTo(
    items,
    {
      y: 50,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: durationInSeconds,
      ease,
    },
  );
};

export const fadeOutUp = (selector: string) => {
  const items = document.querySelectorAll(selector);
  if (items.length === 0) return;

  return gsap.fromTo(
    items,
    {
      y: 0,
      opacity: 1,
    },
    {
      y: -50,
      opacity: 0,
      duration: durationInSeconds,
      ease,
    },
  );
};
