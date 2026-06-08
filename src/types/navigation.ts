import type { FunctionalComponent } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface NavigationItem {
  id: string;
  label?: string;
  to?: RouteLocationRaw;
  icon?: FunctionalComponent;
  href?: string;
  action?: () => void;
  counter?: number;
}
