import { apiHealth } from '@/api/health/apiHealth.ts';
import type { HealthInsightResponse } from '@/api/health/types.ts';
import type { BodyPart, HealthInsightCondition, RecommendedProduct } from '@/types/health.ts';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useHealth = () => {
  const { t } = useI18n();

  const isHealthInsightsLoading = ref(false);
  const healthInsights = ref<HealthInsightResponse | null>(null);

  const fetchInsights = async () => {
    isHealthInsightsLoading.value = true;
    try {
      const res = await apiHealth.getHealthInsights.load();

      healthInsights.value = res.data.value?.data || null;
    } finally {
      isHealthInsightsLoading.value = false;
    }
  };

  const isConditionInsightsLoading = ref(false);
  const conditionInsights = ref<HealthInsightCondition[] | null>(null);
  const fetchConditionInsights = async (bodyPart: BodyPart) => {
    isConditionInsightsLoading.value = true;
    try {
      const res = await apiHealth.getHealthConditionInsights(bodyPart);

      conditionInsights.value = res.data.value?.data || null;
    } finally {
      isConditionInsightsLoading.value = false;
    }
  };

  // Product recommendations
  const isProductRecommendationsLoading = ref(false);
  const productRecommendations = ref<RecommendedProduct[] | null>(null);

  const fetchProductRecommendations = async () => {
    isProductRecommendationsLoading.value = true;
    try {
      const res = await apiHealth.getProductRecommendations.load();

      productRecommendations.value = res.data.value?.data || null;
    } finally {
      isProductRecommendationsLoading.value = false;
    }
  };
  // Insights
  const insightsBodyPartMap = computed<{
    [key in BodyPart]: { label: string };
  }>(() => ({
    head_and_brain: { label: t('headAndBrain') },
    throat_and_neck: { label: t('throatAndNeck') },
    heart: { label: t('heart') },
    lungs: { label: t('lungs') },
    breast_and_mammary: { label: t('breastAndMammary') },
    upper_back: { label: t('upperBack') },
    lower_back: { label: t('lowerBack') },
    abdomen: { label: t('abdomen') },
    kidneys: { label: t('kidneys') },
    pelvis: { label: t('pelvis') },
    shoulders: { label: t('shoulders') },
    arms_and_hands: { label: t('armsAndHands') },
    hips: { label: t('hips') },
    knees: { label: t('knees') },
    feet_and_ankles: { label: t('feetAndAnkles') },
    general_health: { label: t('generalHealth') },
  }));

  return {
    healthInsights,
    fetchInsights,
    isHealthInsightsLoading,
    conditionInsights,
    fetchConditionInsights,
    isConditionInsightsLoading,
    productRecommendations,
    fetchProductRecommendations,
    isProductRecommendationsLoading,
    insightsBodyPartMap,
  };
};
