import { THROTTLE_DELAY } from '@/constants/delays';
import type { SwiperEvent } from '@/types/swiper';
import { useThrottleFn } from '@vueuse/core';
import type { Swiper } from 'swiper/types';
import { computed, ref } from 'vue';

/**
 * Custom swiper composable to handle navigation and pagination.
 */
export const useSwiper = () => {
  const swiper = ref<Swiper | null>(null);
  const isSwiperBeginning = ref(false);
  const isSwiperEnd = ref(false);
  const activeIndex = ref(0);
  const slides = ref<HTMLElement[]>([]);
  const isSwiperSlided = ref<boolean | null>(null); // null means not touched yet, true means touched, false means not touched
  const slidesPerView = ref(0);

  const slidesCount = computed(() => slides.value.length);

  const onSwiperSlideChange = () => {
    isSwiperSlided.value = true;
    updateSwiperStates();
  };

  const onSwiperInit = (event: SwiperEvent) => {
    isSwiperSlided.value = false;

    updateSwiperData(event.detail[0]);
    updateSwiperStates();

    swiper.value?.on('slidesUpdated', (swiperInstance) => {
      updateSwiperData(swiperInstance);
    });
  };

  const updateSwiperStates = () => {
    isSwiperBeginning.value = !!swiper.value?.isBeginning;
    isSwiperEnd.value = !!swiper.value?.isEnd;
    activeIndex.value = swiper.value?.activeIndex || 0;
  };

  const prevSlide = () => swiper.value?.slidePrev();
  const nextSlide = () => swiper.value?.slideNext();

  const updateSwiper = () => {
    swiper.value?.update();
  };

  const updateSwiperData = (swiperInstance: Swiper) => {
    swiper.value = swiperInstance;
    slides.value = swiperInstance.slides;
  };

  const onResize = useThrottleFn((event: SwiperEvent) => {
    /* triggers once when mounting the component and then when resizing */
    /* considering that we have a dynamic slides in the window, we need this in order to display the button nextSlide */
    slidesPerView.value = event.detail[0].slidesPerViewDynamic();
  }, THROTTLE_DELAY);

  return {
    swiper,
    isSwiperBeginning,
    isSwiperEnd,
    onSwiperSlideChange,
    onSwiperInit,
    prevSlide,
    nextSlide,
    activeIndex,
    slidesCount,
    isSwiperSlided,
    updateSwiper,
    onResize,
    slidesPerView,
  };
};
