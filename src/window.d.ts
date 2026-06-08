import type { Chargebee } from '@/types/chargebee';
import type { ZendeskWebWidget } from '@/types/zendesk';

declare global {
  interface Window {
    Chargebee?: Chargebee;
    zE?: ZendeskWebWidget;
  }
}

export {};
