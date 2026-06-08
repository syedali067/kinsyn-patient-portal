<script setup lang="ts">
import ArcSlide from './components/ArcSlide.vue';
import ArcStatsSlide from './components/ArcStatsSlide.vue';
import CircleSlide from './components/CircleSlide.vue';
import CycleSlide from './components/CycleSlide.vue';
import DeviceSettings from './components/DeviceSettings.vue';
import StatsSlide from './components/StatsSlide.vue';
import { useTerraWidget } from './composables/useTerraWidget';
import type { TerraWidgetSlide } from './types';
import type {
  TerraUser,
  TerraUserTerraInfo,
  TerraUserTerraInfoProvider,
} from '@/api/integrations/terra/types';
import IconArrowLeft from '@/assets/icons/arrow-left.svg?component';
import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import IconFilters from '@/assets/icons/filters.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import type { BaseButtonColor } from '@/components/BaseButton/types';
import { useSwiper } from '@/composables/useSwiper';
import { Pagination } from 'swiper/modules';
import { computed, ref } from 'vue';

const props = defineProps<{
  deviceName: TerraUserTerraInfoProvider;
  terraUserId: TerraUserTerraInfo['user_id'];
  slides: TerraWidgetSlide[];
  lastSync: TerraUser['lastEvent'];
}>();

const emit = defineEmits<{
  disconnected: [];
}>();

const { getDeviceName } = useTerraWidget();

const {
  isSwiperBeginning,
  isSwiperEnd,
  onSwiperSlideChange,
  onSwiperInit,
  prevSlide,
  nextSlide,
  activeIndex,
  slidesCount,
} = useSwiper();

const currentSlide = computed(() => props.slides[activeIndex.value] ?? props.slides[0]);
const currentSlideTheme = computed(() => currentSlide.value?.theme ?? 'light');
const slideImages = computed<Record<number, string>>(() =>
  props.slides.reduce(
    (acc, slide, index) => {
      if (slide.bgImage) {
        acc[index] = slide.bgImage;
      }
      return acc;
    },
    {} as Record<number, string>,
  ),
);

const isSettingsOpen = ref(false);

const slideBgClass = computed(() => {
  switch (currentSlideTheme.value) {
    case 'dark':
      return 'bg-black';
    case 'brown':
      return 'bg-stone';
    case 'light':
    default:
      return 'bg-white';
  }
});

const slideTextClass = computed(() => {
  switch (currentSlideTheme.value) {
    case 'brown':
    case 'dark':
      return 'text-white';
    case 'light':
    default:
      return 'text-black';
  }
});

const slideSettingsButtonTextClass = computed<BaseButtonColor>(() => {
  switch (currentSlideTheme.value) {
    case 'brown':
      return 'contrast';
    case 'dark':
      return 'light';
    case 'light':
    default:
      return 'dark';
  }
});

const slideThemeClass = computed(() => {
  switch (currentSlideTheme.value) {
    case 'dark':
      return 'swiper-dark';
    case 'light':
    case 'brown':
    default:
      return 'swiper-light';
  }
});
</script>

<template>
  <div v-if="slides.length > 0" class="rounded-8 relative min-h-580 overflow-hidden">
    <picture class="pointer-events-none absolute inset-0 z-0 size-full" :class="slideBgClass">
      <img
        v-for="image in slideImages"
        :key="image"
        :src="image"
        alt=""
        draggable="false"
        class="absolute inset-0 size-full object-cover"
        :class="
          currentSlide?.bgImage === image
            ? 'opacity-100 transition-opacity duration-500'
            : 'opacity-0 transition-opacity duration-0'
        "
      />

      <div
        class="absolute inset-0 size-full bg-black/45 transition-opacity"
        :class="currentSlide?.bgImage ? 'opacity-100' : 'opacity-0'"
      />
    </picture>

    <div
      class="pointer-events-none absolute top-0 left-0 z-2 flex w-full items-center justify-between p-24"
    >
      <h4 class="text-26 font-secondary" :class="slideTextClass">
        {{ currentSlide?.name }}
      </h4>

      <BaseButton
        :color="slideSettingsButtonTextClass"
        class="pointer-events-auto"
        size="37"
        theme="outline"
        rounded
        @click="isSettingsOpen = true"
      >
        {{ getDeviceName(deviceName) }}

        <template #append>
          <IconFilters class="size-20" />
        </template>
      </BaseButton>
    </div>

    <swiper-container
      class="swiper relative z-1 size-full"
      :class="slideThemeClass"
      :modules="[Pagination]"
      :slides-per-view="1"
      :space-between="24"
      :pagination="slidesCount > 1 ? { clickable: true, dynamicBullets: true } : false"
      :navigation="{
        nextEl: '.terra-swiper-next',
        prevEl: '.terra-swiper-prev',
      }"
      @swiperinit="onSwiperInit"
      @swiperslidechange="onSwiperSlideChange"
    >
      <swiper-slide
        v-for="(slide, index) in slides"
        :key="`${slide.type}-${index}`"
        class="px-24 pt-85 pb-80"
      >
        <ArcSlide v-if="slide.type === 'arc-slide'" :data="slide.data" :theme="slide.theme" />

        <CircleSlide
          v-else-if="slide.type === 'circle-slide'"
          :data="slide.data"
          :theme="slide.theme"
        />

        <ArcStatsSlide
          v-else-if="slide.type === 'arc-stats-slide'"
          :data="slide.data"
          :theme="slide.theme"
        />

        <StatsSlide
          v-else-if="slide.type === 'stat-slide'"
          :data="slide.data"
          :theme="slide.theme"
        />

        <CycleSlide
          v-else-if="slide.type === 'cycle-slide'"
          :data="slide.data"
          :theme="slide.theme"
        />
      </swiper-slide>
    </swiper-container>

    <template v-if="slidesCount > 1">
      <BaseButton
        class="terra-swiper-prev absolute bottom-24 left-1/2 z-2 flex -translate-x-84"
        :color="currentSlideTheme === 'dark' ? 'dark' : 'light'"
        size="32"
        rounded
        :disabled="isSwiperBeginning"
        @click="prevSlide"
      >
        <template #append>
          <IconArrowLeft class="size-20" />
        </template>
      </BaseButton>

      <BaseButton
        class="terra-swiper-next absolute bottom-24 left-1/2 z-2 flex translate-x-52"
        :color="currentSlideTheme === 'dark' ? 'dark' : 'light'"
        size="32"
        rounded
        :disabled="isSwiperEnd"
        @click="nextSlide"
      >
        <template #append>
          <IconArrowRight class="size-20" />
        </template>
      </BaseButton>
    </template>

    <DeviceSettings
      v-model="isSettingsOpen"
      class="absolute inset-0 z-3 transition-opacity"
      :class="isSettingsOpen ? 'opacity-100' : 'pointer-events-none opacity-0'"
      :provider="deviceName"
      :terra-user-id="terraUserId"
      :last-sync="lastSync"
      @disconnected="emit('disconnected')"
    />
  </div>
</template>

<style scoped>
@reference '@/assets/css/main.css';

.swiper::part(pagination) {
  @apply absolute bottom-32 left-1/2 z-3 flex h-16 items-center justify-center;
}

.swiper::part(bullet),
.swiper::part(bullet-active) {
  @apply mx-2 size-8 cursor-pointer rounded-full transition-colors;
}

.swiper-dark::part(bullet) {
  @apply bg-white/25;
}
.swiper-dark::part(bullet):hover {
  @apply bg-white/50;
}
.swiper-dark::part(bullet-active) {
  @apply bg-white;
}

.swiper-light::part(bullet) {
  @apply bg-black/25;
}
.swiper-light::part(bullet):hover {
  @apply bg-black/50;
}
.swiper-light::part(bullet-active) {
  @apply bg-black;
}
</style>
