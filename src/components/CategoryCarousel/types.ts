import type { RouteLocationRaw } from 'vue-router';

export interface CategoryCarouselItem {
  id: number | string;
  title: string;
  image: string;
  link: RouteLocationRaw;
}
