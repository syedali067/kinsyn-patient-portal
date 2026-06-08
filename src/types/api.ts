import type { ToastOptions } from './toast';
import { type UseFetchOptions } from '@vueuse/core';

type Primitive = string | number | boolean;

export type QueryValue =
  | Primitive
  | Primitive[]
  | Record<string, Primitive>
  | Date
  | null
  | undefined;

export type NumberedBoolean = 1 | 0;

export interface RequestInitWithToastsOptions extends RequestInit {
  toastOptions: ToastOptions;
}

export interface ApiOptionsWithToasts extends UseFetchOptions {
  toastOptions?: Partial<ToastOptions>;
}

export interface ExternalApiOptions extends UseFetchOptions {
  redirect?: RequestRedirect;
}
