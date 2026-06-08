<script setup lang="ts">
// INFO: Temporary unused before MVP release
import DrawerInstructionsForUse from './components/DrawerInstructionsForUse.vue';
import ModalAddWeightProgress from './components/ModalAddWeightProgress.vue';
import ModalDeleteProgress from './components/ModalDeleteProgress.vue';
import ModalEditWeightProgress from './components/ModalEditWeightProgress.vue';
import SubscriptionItem from './components/SubscriptionItem.vue';
import { usePharmacy } from './composables/usePharmacy';
import type { DrawerInstructionsForUseSubscription } from './types';
import { apiPharmacy } from '@/api/pharmacy';
import { apiTreatment } from '@/api/treatment';
import IconArrowLeft from '@/assets/icons/arrow-left.svg?component';
import IconArrowRight from '@/assets/icons/arrow-right.svg?component';
import IconDots from '@/assets/icons/dots.svg?component';
import IconImage from '@/assets/icons/image.svg?component';
import IconScale from '@/assets/icons/scale.svg?component';
import IconTrash from '@/assets/icons/trash.svg?component';
import ArcProgress from '@/components/ArcProgress/ArcProgress.vue';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseChart from '@/components/BaseChart/BaseChart.vue';
import BasePopover from '@/components/BasePopover/BasePopover.vue';
import BaseSpinner from '@/components/BaseSpinner/BaseSpinner.vue';
import BaseTabs from '@/components/BaseTabs/BaseTabs.vue';
import ModalUploadFiles from '@/components/ModalUploadFiles/ModalUploadFiles.vue';
import ProductCarousel from '@/components/ProductCarousel/ProductCarousel.vue';
import { useProgress } from '@/composables/useProgress';
import { useStaticData } from '@/composables/useStaticData';
import { useTreatments } from '@/composables/useTreatments';
import { useUploadValidation } from '@/composables/useUploadValidation';
import { ProgressType } from '@/enums/progress';
import { useUserStore } from '@/stores/user';
import type { ProgressCard } from '@/types/progress';
import type { SwiperEvent } from '@/types/swiper';
import type { CategorySlug } from '@/types/treatment';
import type { FileWithMetadata } from '@/types/uploads';
import { waitTransition } from '@/utils/pageTransition.ts';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { format } from 'date-fns';
import type { Swiper } from 'swiper/types';
import { computed, nextTick, ref, watch } from 'vue';

const userStore = useUserStore();

const startPageWeightProgress = 0;
const startPageAllProgress = 0;
const perPageWeightProgress = 10;
const perPageAllProgress = 20;

const {
  weightProgress,
  totalWeightPages,
  currentWeight,
  goalWeight,
  percentAchieved,
  allProgress,
  allProgressTotalCount,
  loadMoreWeightProgressLoading,
  loadMoreAllProgressLoading,
  updateWeightProgressLoading,
  deleteProgressLoading,
  fetchWeightProgress,
  loadMoreWeightProgress,
  fetchAllProgress,
  loadMoreAllProgress,
  updateWeightProgress,
  deleteProgress,
  createWeightProgress,
  createWeightProgressLoading,
  createImageProgress,
  createImageProgressLoading,
} = useProgress(
  startPageWeightProgress,
  perPageWeightProgress,
  startPageAllProgress,
  perPageAllProgress,
);

const { categories } = useStaticData();
const { allowedTypesProgress } = useUploadValidation();
const breakpoints = useBreakpoints(breakpointsTailwind);
const greaterOrEqualLg = breakpoints.greaterOrEqual('lg');
/* for lg size the buttons are very wide, and limiting their width doesn't look very good */
const greaterOrEqualMd = breakpoints.greaterOrEqual('md');

await Promise.all([
  waitTransition(),
  fetchWeightProgress(),
  fetchAllProgress(),
  apiTreatment.getTreatments({ patientId: userStore.userId as number }),
  apiPharmacy.getPharmacy(),
]);

const { subscriptionItems } = useTreatments();
const { pharmacy, weightLossProducts } = usePharmacy();

const currentTab = ref<CategorySlug>('weight-management');
const pageWeightProgress = ref(startPageWeightProgress);
const slideWeightProgress = ref(startPageWeightProgress);
const pageAllProgress = ref(startPageAllProgress);
const activeSlide = ref(0);
const slidesPerView = ref(0);
const isEnd = ref(false);
const isEditMode = ref(false);
const selectedProgress = ref<ProgressCard>();
const selectedSubscription = ref<DrawerInstructionsForUseSubscription>();
const modalUploadFiles = ref<InstanceType<typeof ModalUploadFiles> | null>(null);
const modalAddWeightProgress = ref<InstanceType<typeof ModalAddWeightProgress> | null>(null);
const modalEditWeightProgress = ref<InstanceType<typeof ModalEditWeightProgress> | null>(null);
const swiper = ref<Swiper>();
const isOpenModalUploadFiles = ref(false);
const isOpenModalAddWeightProgress = ref(false);
const isOpenModalDeleteProgress = ref(false);
const isOpenModalEditWeightProgress = ref(false);
const isOpenDrawerInstructionsForUse = ref(false);

const tabCategories = computed(() =>
  [...categories.value].reverse().map((category) => ({
    ...category,
    disabled: category.id !== 'weight-management',
  })),
);

const weightProgressByPage = computed(() => {
  const start = slideWeightProgress.value * perPageWeightProgress;
  const end = start + perPageWeightProgress;
  return weightProgress.value.slice(start, end);
});

const groupedByMonthProgress = computed(() => {
  const monthMap = new Map<string, ProgressCard[]>();

  [...allProgress.value].forEach((progress) => {
    const monthKey = format(new Date(progress.dateCreated), 'MMMM');
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, []);
    }
    monthMap.get(monthKey)?.push(progress);
  });

  return Array.from(monthMap.entries()).map(([month, progress]) => ({
    id: `${month}-${progress[0]?.id ?? month}`,
    month,
    progress,
  }));
});

const totalSlides = computed(() => {
  return groupedByMonthProgress.value.reduce((total, group) => {
    return (
      total +
      group.progress.reduce((subTotal, progress) => {
        if (progress.type === ProgressType.Attachments) {
          return subTotal + (progress.attachments?.length || 0);
        }

        return subTotal + 1;
      }, 0)
    );
  }, 0);
});

const weightLossSubscriptionItems = computed(() =>
  subscriptionItems.value.filter(
    (item) =>
      item.treatment.categorySlug === 'weight-management' &&
      item.variant?.variantType === 'subscription',
  ),
);

const product = computed(() => {
  return pharmacy.value?.products.find((item) => item.id === selectedSubscription.value?.productId);
});

const onSwiperInit = (event: SwiperEvent) => {
  swiper.value = event.detail[0];
};

const onSlideChange = (event: SwiperEvent) => {
  activeSlide.value = event.detail[0].activeIndex;
  isEnd.value = event.detail[0].isEnd;
};

const scrollToStart = () => swiper.value?.slideTo(0, 800);
const prevSlide = () => swiper.value?.slidePrev();
const nextSlide = () => swiper.value?.slideNext();

const onOpenInstructions = (subscription: DrawerInstructionsForUseSubscription) => {
  selectedSubscription.value = subscription;
  isOpenDrawerInstructionsForUse.value = true;
};

const onCreateWeightProgress = async (weight: string) => {
  const response = await createWeightProgress({
    type: ProgressType.Weight,
    weight: +weight,
  });

  if (response) {
    isOpenModalAddWeightProgress.value = false;
    modalAddWeightProgress.value?.clear();
    pageWeightProgress.value = startPageWeightProgress;
    scrollToStart();
  }
};

const onCreateImageProgress = async (files: FileWithMetadata[]) => {
  if (await createImageProgress(files)) {
    isOpenModalUploadFiles.value = false;
    modalUploadFiles.value?.clear();
    scrollToStart();
  }
};

const onEditProgress = async (weight?: number) => {
  if (
    selectedProgress.value &&
    weight &&
    (await updateWeightProgress(
      {
        type: ProgressType.Weight,
        weight,
      },
      selectedProgress.value.id,
    ))
  ) {
    modalEditWeightProgress.value?.clear();
    isOpenModalEditWeightProgress.value = false;
  }
};

const onDeleteProgress = async (progressId: number) => {
  if (await deleteProgress(progressId)) {
    isOpenModalDeleteProgress.value = false;
  }
};

const onLoadMoreAllProgress = async () => {
  if (loadMoreAllProgressLoading.value || !swiper.value) return;
  if (allProgress.value.length >= allProgressTotalCount.value) return;

  const currentIndex = swiper.value.activeIndex;

  pageAllProgress.value += 1;
  await loadMoreAllProgress(pageAllProgress.value);

  await nextTick();
  swiper.value.update();
  swiper.value.slideTo(currentIndex, 0);
  isEnd.value = false;
};

const openModal = (progress: ProgressCard, typeModal: 'edit' | 'delete') => {
  selectedProgress.value = progress;
  if (typeModal === 'delete') {
    isOpenModalDeleteProgress.value = true;
  }
  if (typeModal === 'edit') {
    isOpenModalEditWeightProgress.value = true;
  }
};

const onResize = (event: SwiperEvent) => {
  /* triggers once when mounting the component and then when resizing */
  /* considering that we have a dynamic slides in the window, we need this in order to display the button nextSlide */
  slidesPerView.value = event.detail[0].slidesPerViewDynamic();
};

watch(pageWeightProgress, async (value) => {
  if (!loadMoreWeightProgressLoading.value) {
    if (value > totalWeightPages.value) return;
    await loadMoreWeightProgress(value);
    slideWeightProgress.value = value;
  }
});

watch(isEnd, async (value) => {
  if (value && !loadMoreAllProgressLoading.value) {
    await onLoadMoreAllProgress();
  }
});

watch(
  () => [isOpenModalDeleteProgress.value, isOpenModalEditWeightProgress.value],
  (value) => {
    if (!value) {
      selectedProgress.value = undefined;
    }
  },
);

watch(isOpenDrawerInstructionsForUse, (value) => {
  if (!value) {
    selectedSubscription.value = undefined;
  }
});
</script>

<template>
  <section
    class="row gap-24 pb-56"
    data-testpl="patient-progress"
    data-page-in="fadeInUp"
    data-page-out="fadeOutUp"
  >
    <ModalUploadFiles
      ref="modalUploadFiles"
      v-model="isOpenModalUploadFiles"
      :title="$t('uploadASelfie')"
      :loading="createImageProgressLoading"
      :allowed-types="allowedTypesProgress"
      single-mode
      @submit="onCreateImageProgress"
    />

    <ModalAddWeightProgress
      ref="modalAddWeightProgress"
      v-model="isOpenModalAddWeightProgress"
      :loading="createWeightProgressLoading"
      @upload="onCreateWeightProgress"
    />

    <ModalDeleteProgress
      v-model="isOpenModalDeleteProgress"
      :progress="selectedProgress"
      :loading="deleteProgressLoading"
      @delete="onDeleteProgress"
    />

    <ModalEditWeightProgress
      ref="modalEditWeightProgress"
      v-model="isOpenModalEditWeightProgress"
      :progress="selectedProgress"
      :loading="updateWeightProgressLoading"
      @edit="onEditProgress"
    />

    <DrawerInstructionsForUse
      v-model="isOpenDrawerInstructionsForUse"
      :subscription="selectedSubscription"
      :product
    />

    <!-- TODO: we have no progress now, except for WL, we are not showing all the other categories yet -->
    <BaseTabs
      v-model="currentTab"
      :tabs="tabCategories"
      theme="text"
      class="col-span-4 mt-24 lg:col-span-12 lg:mt-0"
    />

    <template v-if="currentTab === 'weight-management'">
      <div
        class="rounded-8 col-span-4 flex flex-col gap-24 bg-white p-24 lg:gap-32"
        data-testpl="patient-progress-my"
      >
        <h2 class="font-secondary text-26" data-testpl="patient-progress-my-title">
          {{ $t('myProgress') }}
        </h2>

        <ArcProgress
          :progress="percentAchieved"
          class="mx-auto aspect-[376/187] max-w-376"
          theme="light"
          with-percent
        />

        <div class="flex flex-col gap-20" data-testpl="patient-progress-my-text">
          <span
            class="text-18 text-center font-medium"
            data-testpl="patient-progress-my-text-first"
          >
            <template v-if="!weightLossSubscriptionItems.length">
              {{ $t('startATreatmentToSeeProgress') }}
            </template>
            <template v-else-if="weightProgress.length === 1">
              {{ $t('addYourFirstCheckIn') }}
            </template>
            <template v-else-if="percentAchieved !== 0 && percentAchieved !== 100">
              {{ $t('keepUpTheGoodWork') }}
            </template>
            <template v-else-if="percentAchieved === 100">
              {{ $t('congratulationsYouHaveReachedYourGoal') }}
            </template>
          </span>

          <!-- TODO: replace hardcode -->
          <!-- <span class="text-14" data-testpl="patient-progress-my-text-second">
            Praesent rhoncus consectetur leo. Duis in diam ultrices, pharetra nisi non, interdum
            sem. Aliquam sed mi libero. Nunc sit amet mauris turpis.
          </span> -->

          <div
            v-if="weightProgress.length"
            class="flex items-center gap-4"
            data-testpl="patient-progress-my-goal-weight"
          >
            <span> {{ $t('goalWeight') }}: </span>

            <span class="text-18 text-stone" data-testpl="patient-progress-my-goal-weight-value">
              {{ $t('weightLbs', { value: goalWeight }) }}
            </span>
          </div>
        </div>
      </div>

      <div
        class="rounded-8 col-span-4 flex flex-col gap-24 bg-white p-24 lg:col-span-8 lg:gap-32"
        data-testpl="patient-progress-chart"
      >
        <div
          class="flex justify-between gap-16 lg:gap-24"
          data-testpl="patient-progress-chart-info"
        >
          <div class="flex flex-col gap-8" data-testpl="patient-progress-chart-current-weight">
            <h2 class="text-26 text-secondary">
              {{ $t('myCurrentWeight') }}
            </h2>

            <span
              class="text-48 text-secondary text-stone"
              data-testpl="patient-progress-chart-current-weight-value"
            >
              {{ currentWeight ? $t('weightLbs', { value: currentWeight }) : $t('noData') }}
            </span>
          </div>

          <BaseButton
            v-if="allProgress.length !== 0 && greaterOrEqualMd"
            data-testpl="patient-progress-chart-weight-check-in-btn"
            @click="isOpenModalAddWeightProgress = true"
          >
            <template #prepend>
              <IconScale class="size-20" />
            </template>
            {{ $t('weightCheckIn') }}
          </BaseButton>
        </div>

        <div class="relative" data-testpl="patient-progress-chart-slider">
          <Transition
            enter-active-class="animate-[zoomIn_0.3s]"
            leave-active-class="animate-[zoomOut_0.3s]"
          >
            <BaseButton
              v-if="pageWeightProgress"
              size="32"
              rounded
              color="light"
              :disabled="loadMoreWeightProgressLoading"
              class="absolute top-1/2 left-56 z-10 -translate-y-1/2"
              data-testpl="patient-progress-chart-slider-left-btn"
              @click="pageWeightProgress -= 1"
            >
              <template #prepend>
                <IconArrowLeft class="size-20" />
              </template>
            </BaseButton>
          </Transition>

          <BaseChart
            class="h-290"
            :data="weightProgressByPage"
            type="line-indexed"
            curve="curveBumpX"
            :max-length="perPageWeightProgress"
            points
            y-axis
          />

          <Transition
            enter-active-class="animate-[zoomIn_0.3s]"
            leave-active-class="animate-[zoomOut_0.3s]"
          >
            <BaseButton
              v-if="!(pageWeightProgress >= totalWeightPages)"
              size="32"
              rounded
              color="light"
              :disabled="loadMoreWeightProgressLoading"
              class="absolute top-1/2 right-12 z-10 -translate-y-1/2"
              data-testpl="patient-progress-chart-slider-right-btn"
              @click="pageWeightProgress += 1"
            >
              <template #prepend>
                <IconArrowRight class="size-20" />
              </template>
            </BaseButton>
          </Transition>
        </div>

        <BaseButton
          v-if="allProgress.length !== 0 && !greaterOrEqualMd"
          data-testpl="patient-progress-chart-weight-check-in-btn"
          @click="isOpenModalAddWeightProgress = true"
        >
          <template #prepend>
            <IconScale class="size-20" />
          </template>
          {{ $t('weightCheckIn') }}
        </BaseButton>
      </div>

      <div
        class="rounded-8 col-span-4 flex flex-col gap-24 bg-white p-24 lg:col-span-12"
        data-testpl="patient-progress-slider"
      >
        <div class="flex justify-between gap-24">
          <h2 class="font-secondary text-26" data-testpl="patient-progress-slider-title">
            {{ $t('myTimeline') }}
          </h2>

          <div v-if="allProgress.length !== 0 && greaterOrEqualMd" class="flex gap-12">
            <!-- the first entry is always the starting weight, we can't edit it -->
            <BaseButton
              v-if="allProgress.length !== 1"
              theme="outline"
              data-testpl="patient-progress-slider-edit-mode-btn"
              @click="isEditMode = !isEditMode"
            >
              {{ isEditMode ? $t('cancel') : $t('edit') }}
            </BaseButton>

            <BaseButton
              class="w-fit"
              data-testpl="patient-progress-slider-upload-a-selfie-btn"
              @click="isOpenModalUploadFiles = true"
            >
              <template #prepend>
                <IconImage class="size-20" />
              </template>
              {{ $t('uploadASelfie') }}
            </BaseButton>
          </div>
        </div>

        <div
          v-if="allProgress.length !== 0"
          class="flex flex-col gap-24"
          data-testpl="patient-progress-slider-wrapper"
        >
          <div
            class="relative flex w-full items-center gap-24"
            data-testpl="patient-progress-slider-btns-wrapper"
          >
            <Transition
              enter-active-class="animate-[zoomIn_0.3s]"
              leave-active-class="animate-[zoomOut_0.3s]"
            >
              <BaseButton
                v-if="activeSlide"
                size="32"
                rounded
                class="absolute top-1/2 left-24 z-10 -translate-y-1/2"
                data-testpl="patient-progress-slider-prev-slide-btn"
                @click="prevSlide"
              >
                <template #prepend>
                  <IconArrowLeft class="size-20" />
                </template>
              </BaseButton>
            </Transition>
            <swiper-container
              slides-per-view="auto"
              :space-between="greaterOrEqualLg ? 24 : 16"
              :mousewheel="{
                enabled: true,
                forceToAxis: true,
              }"
              class="overflow-hidden"
              data-testpl="patient-progress-slider-swiper"
              @swiperinit="onSwiperInit"
              @swiperslidechange="onSlideChange"
              @swiperresize="onResize"
            >
              <template v-for="group in groupedByMonthProgress" :key="group.id">
                <template v-for="(progress, firstIndex) in group.progress" :key="progress.id">
                  <template v-if="progress.type === ProgressType.Attachments">
                    <swiper-slide
                      v-for="(attachment, secondIndex) in progress.attachments"
                      :key="attachment.id"
                      class="mt-auto w-264"
                      data-testpl="slide"
                    >
                      <div class="flex flex-col gap-24" data-testpl="slide-month-wrapper">
                        <span
                          v-if="secondIndex === 0 && firstIndex === 0"
                          data-testpl="slide-month"
                        >
                          {{ group.month }}
                        </span>

                        <div class="group relative" data-testpl="slide-img-wrapper">
                          <img
                            class="rounded-8 h-352 w-full object-cover"
                            :src="attachment.url"
                            :alt="attachment.filename"
                            data-testpl="slide-img"
                          />

                          <div
                            class="to-coal/50 rounded-8 absolute inset-0 bottom-0 left-0 z-1 flex items-end bg-gradient-to-b from-transparent from-85%"
                            data-testpl="slide-date-gradient"
                          >
                            <span class="text-10 absolute p-8 text-white" data-testpl="slide-date">
                              {{ format(progress.dateCreated, 'MMMM d, EEE') }}
                            </span>
                          </div>

                          <Transition
                            enter-active-class="animate-[zoomIn_0.3s]"
                            leave-active-class="animate-[zoomOut_0.3s]"
                          >
                            <BaseButton
                              v-if="isEditMode"
                              rounded
                              size="32"
                              class="absolute top-8 right-8 z-2"
                              color="light"
                              data-testpl="slide-delete-btn"
                              @click="openModal(progress, 'delete')"
                            >
                              <template #append>
                                <IconTrash class="size-20" />
                              </template>
                            </BaseButton>
                          </Transition>
                        </div>
                      </div>
                    </swiper-slide>
                  </template>

                  <template v-if="progress.type === ProgressType.Weight">
                    <swiper-slide class="mt-auto w-264" data-testpl="slide">
                      <div class="flex flex-col gap-24" data-testpl="slide-month-wrapper">
                        <span v-if="firstIndex === 0" data-testpl="slide-month">
                          {{ group.month }}
                        </span>

                        <figure
                          class="group rounded-8 relative flex h-352 flex-col items-center justify-center gap-8"
                          :class="{
                            'bg-bone': !progress.startedWeight,
                            'bg-beige/50': progress.startedWeight,
                          }"
                          data-testpl="slide-figure"
                        >
                          <span
                            v-if="!progress.startedWeight"
                            class="absolute top-8 right-8"
                            data-testpl="slide-info"
                          >
                            <BasePopover>
                              <template #trigger>
                                <Transition
                                  enter-active-class="animate-[zoomIn_0.3s]"
                                  leave-active-class="animate-[zoomOut_0.3s]"
                                >
                                  <!-- v-show because the element needs to be rendered for the BasePopover opening to work -->
                                  <BaseButton
                                    v-show="isEditMode"
                                    rounded
                                    size="32"
                                    class="z-2"
                                    color="light"
                                    data-testpl="slide-dots-btn"
                                  >
                                    <template #append>
                                      <IconDots class="size-20" />
                                    </template>
                                  </BaseButton>
                                </Transition>
                              </template>

                              <template #content>
                                <div class="rounded-8 text-14 flex min-w-100 flex-col gap-8 p-8">
                                  <BaseButton
                                    size="32"
                                    theme="outline"
                                    data-testpl="slide-edit-btn"
                                    @click="openModal(progress, 'edit')"
                                  >
                                    {{ $t('edit') }}
                                  </BaseButton>

                                  <BaseButton
                                    theme="outline"
                                    size="32"
                                    data-testpl="slide-delete-btn"
                                    @click="openModal(progress, 'delete')"
                                  >
                                    {{ $t('delete') }}
                                  </BaseButton>
                                </div>
                              </template>
                            </BasePopover>
                          </span>

                          <span
                            v-if="progress.meta?.milestoneWeight"
                            class="text-48 text-secondary"
                            data-testpl="slide-weight"
                          >
                            {{
                              $t('weightLbs', {
                                value: progress.meta.milestoneWeight,
                              })
                            }}
                          </span>

                          <span class="text-18" data-testpl="slide-weight-down-or-up">
                            <template v-if="progress.meta?.downWeight">
                              {{
                                $t('weightDown', {
                                  value: progress.meta.downWeight,
                                })
                              }}
                            </template>

                            <template v-if="progress.meta?.upWeight">
                              {{
                                $t('weightUp', {
                                  value: progress.meta.upWeight,
                                })
                              }}
                            </template>
                          </span>

                          <span v-if="progress.startedWeight" data-testpl="slide-weight-starting">
                            {{ $t('startingWeight') }}
                          </span>

                          <span
                            class="text-10 absolute bottom-8 left-8 z-10"
                            data-testpl="slide-date"
                          >
                            {{ format(progress.dateCreated, 'MMMM d, EEE') }}
                          </span>
                        </figure>
                      </div>
                    </swiper-slide>
                  </template>
                </template>
              </template>

              <swiper-slide
                class="my-auto max-w-20"
                v-if="loadMoreAllProgressLoading"
                data-testpl="slide"
              >
                <BaseSpinner class="size-20" />
              </swiper-slide>
            </swiper-container>

            <Transition
              enter-active-class="animate-[zoomIn_0.3s]"
              leave-active-class="animate-[zoomOut_0.3s]"
            >
              <BaseButton
                v-if="!isEnd && slidesPerView < totalSlides"
                size="32"
                rounded
                class="absolute top-1/2 right-24 z-10 -translate-y-1/2"
                data-testpl="patient-progress-slider-next-slide-btn"
                @click="nextSlide"
              >
                <template #prepend>
                  <IconArrowRight class="size-20" />
                </template>
              </BaseButton>
            </Transition>
          </div>

          <div v-if="allProgress.length !== 0 && !greaterOrEqualMd" class="flex flex-col gap-12">
            <BaseButton
              v-if="allProgress.length !== 1"
              theme="outline"
              data-testpl="patient-progress-slider-edit-mode-btn"
              @click="isEditMode = !isEditMode"
            >
              {{ isEditMode ? $t('cancel') : $t('edit') }}
            </BaseButton>

            <BaseButton
              data-testpl="patient-progress-slider-edit-mode-btn"
              @click="isOpenModalUploadFiles = true"
            >
              <template #prepend>
                <IconImage class="size-20" />
              </template>
              {{ $t('uploadASelfie') }}
            </BaseButton>
          </div>
        </div>

        <div
          v-else
          class="flex flex-col items-center justify-center gap-16"
          data-testpl="patient-progress-no-slides"
        >
          <IconImage class="size-40" data-testpl="patient-progress-no-slides-icon" />

          <span class="text-18 font-bold" data-testpl="patient-progress-no-slides-text-first">
            {{ $t('startYourTreatmentToActivateTimeline') }}
          </span>

          <p
            class="text-secondary-text text-14 max-w-424 text-center"
            data-testpl="patient-progress-no-slides-text-second"
          >
            {{ $t('discoverWhichTreatmentBestSuitsYou') }}
          </p>

          <!-- TODO: need quiz link -->
          <BaseButton data-testpl="patient-progress-no-slides-see-treatments-btn">
            {{ $t('seeTreatments') }}
          </BaseButton>
        </div>
      </div>

      <div
        v-if="weightLossSubscriptionItems.length !== 0"
        class="col-span-4 flex flex-col gap-24 lg:col-span-12"
        data-testpl="patient-progress-my-treatment"
      >
        <h2 class="font-secondary text-26" data-testpl="patient-progress-my-treatment-title">
          {{ $t('myTreatment') }}
        </h2>

        <ul class="flex flex-col gap-24" data-testpl="patient-progress-my-treatment-list">
          <SubscriptionItem
            v-for="subscription in weightLossSubscriptionItems"
            :key="subscription.id"
            :subscription
            @open-instructions="onOpenInstructions"
          />
        </ul>
      </div>

      <div
        v-if="weightLossSubscriptionItems.length !== 0"
        class="col-span-4 flex flex-col gap-24 lg:col-span-12"
        data-testpl="patient-progress-products"
      >
        <div class="flex justify-between gap-24">
          <h2 class="font-secondary text-26" data-testpl="patient-progress-products-title">
            {{ $t('relatedProducts') }}
          </h2>

          <BaseButton
            theme="link"
            :to="{
              name: 'PatientPharmacyCategory',
              params: {
                categorySlug: currentTab,
              },
            }"
          >
            {{ $t('seeAll') }}
          </BaseButton>
        </div>

        <ProductCarousel class="-mr-16 lg:-mr-24" :products="weightLossProducts" />
      </div>
    </template>
  </section>
</template>
