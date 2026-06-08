import { apiProgress } from '@/api/progress';
import type { WeightProgressPayload } from '@/api/progress/types';
import { ProgressType } from '@/enums/progress';
import { useToastStore } from '@/stores/toast';
import type { ProgressCard, WeightProgressCard } from '@/types/progress';
import type { FileWithMetadata } from '@/types/uploads';
import { computed, ref } from 'vue';

export const useProgress = (
  startPageWeightProgress: number = 0,
  perPageWeightProgress: number = 20,
  startPageAllProgress: number = 0,
  perPageAllProgress: number = 20,
) => {
  const toastStore = useToastStore();

  const weightProgress = ref<WeightProgressCard[]>([]);
  const weightProgressTotalCount = ref(0);
  const firstWeight = ref(0);
  const goalWeight = ref(0);

  const allProgress = ref<ProgressCard[]>([]);
  const allProgressTotalCount = ref(0);

  const weightProgressLoading = ref(false);
  const loadMoreWeightProgressLoading = ref(false);
  const allProgressLoading = ref(false);
  const loadMoreAllProgressLoading = ref(false);
  const updateWeightProgressLoading = ref(false);
  const deleteProgressLoading = ref(false);
  const createWeightProgressLoading = ref(false);
  const createImageProgressLoading = ref(false);

  const currentWeight = computed(() => {
    if (weightProgress.value.length) {
      return weightProgress.value[0]?.value ?? 0;
    }
    return 0;
  });

  const percentAchieved = computed(() => {
    if (weightProgress.value.length === 1 || firstWeight.value === 0 || goalWeight.value === 0)
      return 0;
    if (goalWeight.value >= currentWeight.value) return 100;
    const rawValue =
      ((firstWeight.value - currentWeight.value) / (firstWeight.value - goalWeight.value)) * 100;
    return Math.max(0, Math.min(100, Math.round(rawValue))) ?? 0;
  });

  const totalWeightPages = computed(() => {
    return Math.ceil(weightProgressTotalCount.value / perPageWeightProgress) - 1;
  });

  const fetchWeightProgress = async (ignoreCache: boolean = false) => {
    try {
      weightProgressLoading.value = true;
      const request = ignoreCache
        ? apiProgress.getWeightProgress.load
        : apiProgress.getWeightProgress;
      const response = await request({
        page: startPageWeightProgress,
        perPage: perPageWeightProgress,
      });

      if (response.data.value) {
        weightProgress.value = response.data.value.data.userProgressData || [];
        weightProgressTotalCount.value = response.data.value.pages?.totalCount ?? 0;
        firstWeight.value = response.data.value.data.firstWeight ?? 0;
        goalWeight.value = response.data.value.data.goalWeight ?? 0;
      }
    } finally {
      weightProgressLoading.value = false;
    }
  };

  const loadMoreWeightProgress = async (nextPage: number) => {
    try {
      loadMoreWeightProgressLoading.value = true;
      const response = await apiProgress.getWeightProgress({
        page: nextPage,
        perPage: perPageWeightProgress,
      });

      if (response.statusCode.value !== 200) {
        return;
      }

      if (response.data.value?.data) {
        weightProgress.value?.push(...response.data.value.data.userProgressData);
      }
    } finally {
      loadMoreWeightProgressLoading.value = false;
    }
  };

  const fetchAllProgress = async (ignoreCache: boolean = false) => {
    try {
      allProgressLoading.value = true;
      const request = ignoreCache ? apiProgress.getAllProgress.load : apiProgress.getAllProgress;
      const response = await request({
        page: startPageAllProgress,
        perPage: perPageAllProgress,
      });
      allProgress.value = response.data.value?.data || [];
      allProgressTotalCount.value = response.data.value?.pages?.totalCount || 0;
    } finally {
      allProgressLoading.value = false;
    }
  };

  const loadMoreAllProgress = async (nextPage: number) => {
    try {
      loadMoreAllProgressLoading.value = true;

      const response = await apiProgress.getAllProgress({
        page: nextPage,
        perPage: perPageAllProgress,
      });

      if (response.statusCode.value !== 200) {
        return;
      }

      if (response.data.value?.data) {
        allProgress.value?.push(...response.data.value.data);
      }
    } finally {
      loadMoreAllProgressLoading.value = false;
    }
  };

  const updateWeightProgress = async (payload: WeightProgressPayload, progressId: number) => {
    try {
      updateWeightProgressLoading.value = true;
      const response = await apiProgress.updateWeightProgress(payload, progressId);

      if (response.statusCode.value !== 200) {
        return false;
      }

      toastStore.addToast({
        type: 'success',
        text: response.data.value?.message,
      });
      /*
        in this case it is better to search by ID instead of just passing the index as an argument,
        since the final array is modified and divided into fragments with dates
      */
      if (response.data.value?.data) {
        const newData = response.data.value.data;
        const allProgressIndex = allProgress.value?.findIndex(
          (progress) => progress.id === progressId,
        );

        if (allProgressIndex !== -1) {
          allProgress.value.splice(allProgressIndex, 1, newData);
        }

        const weightProgressIndex = weightProgress.value?.findIndex(
          (progress) => progress.id === progressId,
        );

        if (weightProgressIndex !== -1 && newData.meta?.milestoneWeight) {
          weightProgress.value.splice(weightProgressIndex, 1, {
            id: newData.id,
            value: newData.meta.milestoneWeight,
            date: newData.dateCreated,
          });
        }
      }

      return true;
    } finally {
      updateWeightProgressLoading.value = false;
    }
  };

  const deleteProgress = async (progressId: number) => {
    try {
      deleteProgressLoading.value = true;
      const response = await apiProgress.deleteProgress(progressId);

      if (response.statusCode.value !== 200) {
        return false;
      }

      toastStore.addToast({
        type: 'success',
        text: response.data.value?.message,
      });
      /*
        in this case it is better to search by ID instead of just passing the index as an argument,
        since the final array is modified and divided into fragments with dates
      */
      if (response.data.value?.data) {
        const allProgressIndex = allProgress.value?.findIndex(
          (progress) => progress.id === progressId,
        );

        if (allProgressIndex !== -1) {
          allProgress.value.splice(allProgressIndex, 1);
          allProgressTotalCount.value -= 1;
        }

        const weightProgressIndex = weightProgress.value?.findIndex(
          (progress) => progress.id === progressId,
        );

        if (weightProgressIndex !== -1) {
          weightProgress.value.splice(weightProgressIndex, 1);
          weightProgressTotalCount.value -= 1;
        }
      }

      return true;
    } finally {
      deleteProgressLoading.value = false;
    }
  };

  const createWeightProgress = async (payload: WeightProgressPayload) => {
    try {
      createWeightProgressLoading.value = true;

      const response = await apiProgress.createWeightProgress(payload);

      if (response.statusCode.value !== 200) {
        return;
      }

      toastStore.addToast({
        type: 'success',
        text: response.data.value?.message,
      });

      if (response.data.value?.data) {
        const newData = response.data.value.data;
        allProgress.value = [newData, ...allProgress.value];
        allProgressTotalCount.value += 1;

        if (newData.meta?.milestoneWeight) {
          weightProgress.value = [
            {
              id: newData.id,
              value: newData.meta.milestoneWeight,
              date: newData.dateCreated,
            },
            ...weightProgress.value,
          ];
          weightProgressTotalCount.value += 1;
        }
      }

      return response;
    } finally {
      createWeightProgressLoading.value = false;
    }
  };

  const createImageProgress = async (files: FileWithMetadata[]) => {
    try {
      createImageProgressLoading.value = true;

      const formData = new FormData();
      formData.append('type', ProgressType.Attachments.toString());
      files.forEach((file, i) => {
        formData.append(`attachments[${i}]`, file.file);
      });
      const response = await apiProgress.createImageProgress(formData);

      if (response.statusCode.value !== 200) {
        return false;
      }

      toastStore.addToast({
        type: 'success',
        text: response.data.value?.message,
      });

      if (response.data.value?.data) {
        const newData = response.data.value.data;
        allProgress.value = [newData, ...allProgress.value];
        allProgressTotalCount.value += 1;
      }

      return true;
    } finally {
      createImageProgressLoading.value = false;
    }
  };

  return {
    weightProgress,
    weightProgressTotalCount,
    totalWeightPages,
    currentWeight,
    firstWeight,
    goalWeight,
    percentAchieved,
    allProgress,
    allProgressTotalCount,
    weightProgressLoading,
    loadMoreWeightProgressLoading,
    allProgressLoading,
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
  };
};
