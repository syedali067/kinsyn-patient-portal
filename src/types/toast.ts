export type ToastType = 'neutral' | 'success' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  text: string;
  duration: number;
  closeBtn: boolean;
  displayError: boolean;
}

export interface ToastOptions {
  type?: ToastType;
  text?: string;
  duration?: number;
  closeBtn?: boolean;
  displayError?: boolean;
}
