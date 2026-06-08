import type { ModifiedSubscriptionItem, ModifiedSubscriptionItemType } from '@/types/subscription';
import { formatPrice, formatUnitPeriod } from '@/utils/formatters';
import { getPlanStatus } from '@/utils/planStatus';
import { format } from 'date-fns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export function useSubscriptionItem(subscription: ModifiedSubscriptionItem) {
  const { t } = useI18n();

  const planStatus = computed(() => getPlanStatus(subscription.treatment));

  const imageUrl = computed(() =>
    subscription.isPrescription
      ? subscription.productPrescription?.product.image?.url
      : subscription.product?.image?.url || subscription.productPrescription?.product.image?.url,
  );

  const imageAlt = computed(() =>
    subscription.isPrescription
      ? subscription.productPrescription?.product.title
      : subscription.product?.title || subscription.productPrescription?.product.title,
  );

  const isRxOnly = computed(() =>
    subscription.isPrescription
      ? subscription.productPrescription?.product?.rxOnly
      : subscription?.product?.rxOnly,
  );

  const categoryName = computed(() => subscription.treatment.categorySlug?.replace(/-/g, ' '));

  const itemType = computed<ModifiedSubscriptionItemType>(() =>
    subscription.variant?.variantType === 'subscriptionAddon' ? 'addon' : 'treatment',
  );

  const itemTitle = computed(() =>
    subscription.isPrescription
      ? subscription.productPrescription?.product.title
      : subscription.product?.title || subscription.productPrescription?.product.title,
  );

  const isMonthly = computed(
    () =>
      subscription.variant?.variantPeriodUnit === 'month' &&
      subscription.variant?.variantPeriod === 1,
  );
  const formatPriceWithPeriod = (price: number) => {
    if (!subscription.variant?.variantPeriodUnit || !subscription?.variant.variantPeriod) {
      return formatPrice(price);
    }

    if (isMonthly.value) {
      return `${formatPrice(price)}/${t('month')}`;
    }

    return `${formatPrice(price)}/${formatUnitPeriod(
      subscription.variant.variantPeriod,
      subscription.variant.variantPeriodUnit,
    )}`;
  };

  const formattedPriceWithPeriod = computed(() => formatPriceWithPeriod(subscription.subtotal));
  const formattedPriceWithDiscount = computed(() => formatPriceWithPeriod(subscription.total));

  const formattedDosage = computed(() => {
    const dosage = subscription.isPrescription
      ? subscription.productPrescription?.dosage
      : subscription.dosagePrescription;
    const unit = subscription.isPrescription
      ? subscription.productPrescription?.dosageUnit
      : subscription.dosageUnitPrescription;

    return dosage ? `${dosage / 100}${unit || ''}` : '';
  });

  const quantity = computed(() => (subscription.quantity > 1 ? subscription.quantity : 0));

  const cancellationDate = computed(() =>
    subscription.dateCancelled ? format(subscription.dateCancelled, 'MMMM d, y') : '',
  );

  const nextShipmentDate = computed(() =>
    subscription.treatment.subscription?.dateNext
      ? format(subscription.treatment.subscription.dateNext, 'MMMM d, yyyy')
      : '',
  );

  const isMonthlyShippingSubscription = computed(
    () =>
      subscription.variant?.variantShippingPeriodUnit === 'month' &&
      subscription.variant?.variantShippingPeriod === 1,
  );

  return {
    planStatus,
    imageUrl,
    imageAlt,
    isRxOnly,
    categoryName,
    itemType,
    itemTitle,
    formattedPriceWithDiscount,
    formattedPriceWithPeriod,
    formattedDosage,
    quantity,
    cancellationDate,
    nextShipmentDate,
    isMonthlyShippingSubscription,
  };
}
