import type { DownloadInvoiceLinkResponse, GetShipmentsPayload } from '@/api/shipments/types';
import { useApi } from '@/composables/useApi';
import type { Response } from '@/types/response';
import type { Shipment, ShipmentDetails, ShipmentGroups } from '@/types/shipment';
import { useMemoize } from '@vueuse/core';
import { stringifyQuery } from 'vue-router';

const getShipmentGroups = useMemoize((payload: GetShipmentsPayload = {}) => {
  const params = stringifyQuery({ ...payload });

  return useApi<Response<ShipmentGroups>>(`/api/v2/shipments/groups?${params}`).get();
});

const getDownloadInvoiceLink = useMemoize((id: Shipment['invoice']['id']) => {
  return useApi<Response<DownloadInvoiceLinkResponse>>(`/api/v1/invoice/${id}/download`).get();
});

const getShipment = useMemoize((id: Shipment['id']) => {
  return useApi<Response<ShipmentDetails>>(`/api/v2/shipments/${id}`).get();
});

export const apiShipment = {
  getShipmentGroups,
  getDownloadInvoiceLink,
  getShipment,
};
