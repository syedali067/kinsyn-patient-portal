import type { ToastType } from '@/types/toast.ts';

export type RedirectToastOption = {
  route: string;
  type: ToastType;
  message: string;
};
