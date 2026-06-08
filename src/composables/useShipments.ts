import { useStaticData } from './useStaticData';
import { apiShipment } from '@/api/shipments';
import type { GetShipmentsPayload } from '@/api/shipments/types';
import { ShipmentStatus } from '@/enums/shipment';
import type { ShipmentAddressFormattedData } from '@/pages/PagePatientOrderHistory/types';
import type { PaginationPayload } from '@/types/pagination';
import type {
  OrderItem,
  OrderItemWithSubscription,
  Shipment,
  ShipmentDetailsAddress,
} from '@/types/shipment';
import type { CategorySlug } from '@/types/treatment';
import { downloadFile } from '@/utils/download';
import { stringToSecondaryReadableDateFormat } from '@/utils/formatters';
import { getYear } from 'date-fns';
import { unionBy } from 'lodash-es';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useShipments = (params?: PaginationPayload) => {
  const { t } = useI18n();
  const { categories } = useStaticData();

  const shipments = ref<Shipment[] | null>(null);
  const shipmentsTotalCount = ref(0);
  const upcomingShipmentsItems = ref<OrderItemWithSubscription[]>([]);
  const years = ref<number[]>([]);

  const shipmentsLoading = ref(false);
  const getUpcomingShipmentsItemsLoading = ref(false);

  const findLabelCategoryById = (category: CategorySlug) =>
    categories.value.find((cat) => cat.id === category)?.label ?? '';

  const fetchShipments = async (page: PaginationPayload['page'], year?: number) => {
    shipmentsLoading.value = true;

    try {
      const response = await apiShipment.getShipmentGroups({
        page,
        perPage: params?.perPage || 20,
        year,
      });

      if (response.statusCode.value !== 200) {
        return;
      }

      if (response.data.value?.data) {
        shipments.value = response.data.value.data.orders || [];
        shipmentsTotalCount.value = response.data.value?.pages?.totalCount || 0;

        const yearsList = [...response.data.value.data.years];
        const currentYear = getYear(new Date());
        if (!yearsList.includes(currentYear)) {
          yearsList.push(currentYear);
        }

        years.value = yearsList.sort((a, b) => b - a);
      }
    } finally {
      shipmentsLoading.value = false;
    }
  };

  const updateShipments = async (page: PaginationPayload['page'], year?: number) => {
    if (
      (shipments.value && shipments.value.length >= shipmentsTotalCount.value) ||
      shipmentsLoading.value
    ) {
      return;
    }

    shipmentsLoading.value = true;

    try {
      const response = await apiShipment.getShipmentGroups({
        page,
        perPage: params?.perPage || 20,
        year,
      });

      if (response.statusCode.value !== 200) {
        return;
      }

      if (response.data.value?.data) {
        shipments.value = unionBy(shipments.value, response.data.value.data.orders, 'id');
        shipmentsTotalCount.value = response.data.value?.pages?.totalCount || 0;
      }
    } finally {
      shipmentsLoading.value = false;
    }
  };

  const getShipment = async (id: Shipment['id']) => {
    const response = await apiShipment.getShipment(id);

    if (response.statusCode.value !== 200) {
      return;
    }

    return response.data.value?.data;
  };

  const downloadInvoice = async (id: Shipment['invoice']['id']) => {
    const response = await apiShipment.getDownloadInvoiceLink(id);

    if (response.statusCode.value !== 200) {
      return;
    }

    if (response.data.value?.data) {
      downloadFile(response.data.value?.data.downloadUrl);
    }
  };

  const shipmentStatusTextMap: Record<ShipmentStatus, string> = {
    [ShipmentStatus.All]: '',
    [ShipmentStatus.Queued]: t('queued'),
    [ShipmentStatus.AwaitingShipment]: t('awaitingShipment'),
    [ShipmentStatus.OnHold]: t('onHold'),
    [ShipmentStatus.Delivered]: t('delivered'),
    [ShipmentStatus.Shipped]: t('shipped'),
    [ShipmentStatus.PartiallyDelivered]: t('partiallyDelivered'),
    [ShipmentStatus.Returned]: t('returned'),
    [ShipmentStatus.Cancelled]: t('cancelled'),
    [ShipmentStatus.SentToPharmacy]: t('sentToPharmacy'),
  };

  const getShipmentStatus = (statusCode: ShipmentStatus) => shipmentStatusTextMap[statusCode] ?? '';

  const getShipmentStatusText = (orderItem: OrderItem) => {
    if (orderItem.status === ShipmentStatus.Delivered && orderItem.dateCompleted) {
      return `${t('deliveredOn')} ${stringToSecondaryReadableDateFormat(orderItem.dateCompleted)}`;
    }

    if (orderItem.status === ShipmentStatus.PartiallyDelivered) {
      return t('partiallyDelivered');
    }

    if (
      orderItem.status === ShipmentStatus.Queued ||
      orderItem.status === ShipmentStatus.AwaitingShipment ||
      orderItem.status === ShipmentStatus.SentToPharmacy
    ) {
      return t('orderIsBeingFilled');
    }

    if (orderItem.status === ShipmentStatus.Shipped && orderItem.dateShipped) {
      return `${t('packageHasBeenShippedOn')} ${stringToSecondaryReadableDateFormat(orderItem.dateShipped)}`;
    }

    if (orderItem.status === ShipmentStatus.OnHold) {
      return t('orderIsOnHold');
    }

    if (
      orderItem.status === ShipmentStatus.Cancelled ||
      orderItem.status === ShipmentStatus.Returned
    ) {
      return t('orderHasBeenCanceled');
    }
  };

  const getFormattedAddress = (
    address: ShipmentDetailsAddress | null | undefined,
  ): ShipmentAddressFormattedData[] => {
    if (!address) {
      return [];
    }

    const name = `${address.first_name || ''} ${address.last_name || ''}`.trim();
    const location = [address.city, address.state, address.zip].filter(Boolean).join(', ').trim();

    return [
      {
        value: name,
      },
      {
        isSecondary: true,
        value: address.line1,
      },
      {
        isSecondary: true,
        value: address.line2,
      },
      {
        isSecondary: true,
        value: location,
      },
      {
        isSecondary: true,
        value: address.country,
      },
      {
        isSecondary: true,
        value: address.phone,
        isPhoneNumber: true,
      },
      {
        isSecondary: true,
        value: address.email,
        isEmail: true,
      },
    ].filter((item) => item.value && item.value.trim() !== '');
  };

  const getUpcomingShipmentsItems = async (payload?: GetShipmentsPayload) => {
    if (getUpcomingShipmentsItemsLoading.value) {
      return;
    }

    try {
      getUpcomingShipmentsItemsLoading.value = true;
      const { data } = await apiShipment.getShipmentGroups(payload);

      const orderItems = data.value?.data.orders.flatMap((shipment) =>
        shipment.orderItems.map((item) => ({
          ...item,
          subscription: shipment.invoice.subscription,
        })),
      );

      upcomingShipmentsItems.value =
        orderItems?.filter(
          (item) =>
            item.status !== ShipmentStatus.Cancelled &&
            item.status !== ShipmentStatus.Delivered &&
            item.status !== ShipmentStatus.Queued &&
            item.status !== ShipmentStatus.Returned,
        ) || [];
    } finally {
      getUpcomingShipmentsItemsLoading.value = false;
    }
  };

  return {
    shipments,
    fetchShipments,
    updateShipments,
    shipmentsLoading,
    getShipment,
    getShipmentStatus,
    getShipmentStatusText,
    downloadInvoice,
    getFormattedAddress,
    upcomingShipmentsItems,
    getUpcomingShipmentsItemsLoading,
    getUpcomingShipmentsItems,
    findLabelCategoryById,
    years,
  };
};
