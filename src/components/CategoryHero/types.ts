import type { RouteLocationRaw } from 'vue-router';

export interface CategoryHeroData {
  title: string;
  link?: RouteLocationRaw;
  image?: string;
  caption?: string;
}
