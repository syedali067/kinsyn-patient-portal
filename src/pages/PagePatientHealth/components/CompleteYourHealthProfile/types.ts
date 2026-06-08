import type { Component } from 'vue';

export type ContentItem = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  icon?: Component | string;
  completeText?: string;
  buttonTitle?: string;
  buttonFunc?: () => void;
  loading?: boolean;
};
