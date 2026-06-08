<script setup lang="ts">
import DevicesSlider from './DevicesSlider.vue';
import IconFilters from '@/assets/icons/filters.svg?component';
import IconTime from '@/assets/icons/time.svg?component';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import CardSlider from '@/components/CardSlider/CardSlider.vue';
import CardSliderSlide from '@/components/CardSlider/CardSliderSlide.vue';
import { useTerraWidget } from '@/components/TerraWidget/composables/useTerraWidget';
import { t } from '@/locales/i18n';
import type { TerraMapping } from '@/types/integration.ts';
import { ref, onMounted, onUnmounted, watch } from 'vue';

defineProps<{
  data: TerraMapping[];
}>();

const WIDTH_NARROW_BLOCK = 332;
const containerRef = ref<HTMLElement | null>(null);
const isNarrow = ref(false);

onMounted(() => {
  const observer = new ResizeObserver((entries) => {
    const width = entries[0]?.contentRect.width ?? 0;
    isNarrow.value = width < WIDTH_NARROW_BLOCK;
  });

  if (containerRef.value) {
    observer.observe(containerRef.value);
  }

  onUnmounted(() => {
    observer.disconnect();
  });
});

const isSettingsOpen = ref(false);

const { endUsers, getEndUsers } = useTerraWidget();

await getEndUsers();

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value;
};

watch(
  () => endUsers.value,
  () => {
    if (endUsers.value.length === 0) {
      isSettingsOpen.value = false;
    }
  },
);
</script>

<template>
  <div
    class="rounded-8 relative flex min-h-453 min-w-0 flex-col gap-32 bg-white p-16 lg:p-24"
    ref="containerRef"
    data-testpl="dashboard-vitals"
  >
    <div class="flex items-center justify-between gap-8">
      <h2 class="text-21 lg:text-26 font-secondary">
        {{ $t('vitals') }}
      </h2>

      <BaseButton
        class="pointer-events-auto"
        size="32"
        :theme="isSettingsOpen ? 'solid' : 'outline'"
        rounded
        :disabled="!endUsers.length"
        data-testpl="dashboard-vitals-settings-button-toggler"
        @click="toggleSettings"
      >
        {{ t('settings') }}

        <template #append>
          <IconFilters class="size-20" />
        </template>
      </BaseButton>
    </div>

    <CardSlider v-if="!isSettingsOpen" data-testpl="widget-vitals-swiper">
      <CardSliderSlide v-for="(card, index) in data" :key="index" with-bottom-spacing>
        <div class="user-select-none flex flex-col justify-between gap-24 lg:gap-32">
          <h3 class="text-21 font-secondary text-sand uppercase" data-testpl="widget-vitals-title">
            {{ card.title }}
          </h3>
          <div class="flex flex-col items-center gap-34">
            <div
              v-for="item in card.values"
              :key="item.label"
              class="relative flex w-full"
              data-testpl="widget-vitals-item"
              :class="[isNarrow ? 'items-start gap-8' : 'items-center gap-16']"
            >
              <figure
                class="bg-bone rounded-8 flex size-64 shrink-0 flex-col items-center justify-center py-8"
              >
                <component
                  :is="item?.icon"
                  v-if="item?.icon"
                  class="size-32 shrink-0"
                  data-testpl="widget-vitals-icon"
                />
              </figure>
              <div class="flex flex-col gap-4">
                <span class="capitalize"> {{ item.label }} </span>
                <div class="flex flex-wrap items-end gap-4">
                  <p class="flex items-end gap-4">
                    <template v-if="typeof item.value === 'object'">
                      <template v-if="item.value.hours">
                        <span
                          :class="[isNarrow ? 'text-32' : 'text-48']"
                          class="font-secondary font-medium"
                        >
                          {{ item.value.hours }}
                        </span>
                        <span :class="[isNarrow ? 'pb-5' : 'pb-3']">h</span>
                      </template>
                      <span
                        :class="[isNarrow ? 'text-32' : 'text-48']"
                        class="font-secondary font-medium"
                      >
                        {{ item.value.minutes }}
                      </span>
                      <span :class="[isNarrow ? 'pb-5' : 'pb-3']">min</span>
                    </template>
                    <span
                      v-else
                      :class="[isNarrow ? 'text-32' : 'text-48']"
                      class="font-secondary font-medium"
                    >
                      {{ item.value }}
                    </span>
                    <span
                      v-if="item.measurementValue"
                      :class="[isNarrow ? 'pb-5' : 'pb-3']"
                      class="lowercase"
                    >
                      {{ item.measurementValue }}
                    </span>
                  </p>
                  <div
                    v-if="item.valueDiffLb || item.valueDiffSleep"
                    :class="[isNarrow ? 'pb-5' : 'pb-3']"
                    class="flex items-end"
                  >
                    <template v-if="item.valueDiffLb">
                      <span> {{ item.valueDiffLb < 0 ? '↓' : '↑' }}</span>
                      <span v-if="item.valueDiffLb > 0">+</span>
                      <span class="lowercase">{{ item.valueDiffLb }}</span>
                      <span class="lowercase">
                        {{ item.measurementValue }}
                      </span>
                    </template>
                    <template v-if="item.valueDiffSleep">
                      <span class="ml-4 lowercase">
                        <template v-if="typeof item.valueDiffSleep === 'object'">
                          <template v-if="item.valueDiffSleep.hours">
                            {{ item.valueDiffSleep.isNegative ? '-' : '+'
                            }}{{ item.valueDiffSleep.hours }}<span>h </span>
                          </template>
                          <span v-if="!item.valueDiffSleep.hours">
                            {{ item.valueDiffSleep.isNegative ? '-' : '+' }} </span
                          >{{ item.valueDiffSleep.minutes }}<span>min </span>vs avg
                        </template>
                        <template v-else>{{ item.valueDiffSleep }} vs avg</template>
                      </span>
                    </template>
                  </div>
                </div>
              </div>
              <div
                class="text-12 text-secondary-text bg-bone absolute top-0 right-0 flex h-fit items-center gap-4 rounded-full py-4"
                :class="[isNarrow ? 'px-4' : 'px-8']"
              >
                <IconTime class="size-16 shrink-0" />
                {{ item.date }}
              </div>
            </div>
          </div>
        </div>
      </CardSliderSlide>
    </CardSlider>

    <DevicesSlider
      v-model="isSettingsOpen"
      :end-users="endUsers"
      class="absolute top-0 left-0 size-full"
    />
  </div>
</template>
