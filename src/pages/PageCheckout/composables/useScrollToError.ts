import { nextTick } from 'vue';

export const useScrollToError = (selector: string) => {
  const scrollToError = async () => {
    await nextTick();
    const errorSection = document.querySelector(selector);
    errorSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return {
    scrollToError,
  };
};
