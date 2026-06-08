import type { PaginationPayload } from '@/types/pagination';
import type { SortValuesShipmentsFilters } from '@/types/shipment';

export interface GetShipmentsPayload extends PaginationPayload {
  sort?: SortValuesShipmentsFilters;
  status?: string;
  year?: number;
}

export interface DownloadInvoiceLinkResponse {
  invoiceId: number;
  downloadUrl: string;
}
