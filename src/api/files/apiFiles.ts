import { useApi } from '@/composables/useApi.ts';
import type { Response } from '@/types/response';

const getImage = (url: string) => {
  return useApi<string>(url, { toastOptions: { displayError: false } }).get();
};

const uploadDocument = (payload: FormData) => {
  return useApi<Response<string>>('/api/v1/document/document/document').post(payload);
};

const uploadIdPicture = (payload: FormData) => {
  return useApi<Response<string>>('/api/v1/document/document/idPicture').post(payload);
};

const deleteIdPicture = () => {
  return useApi<Response<string>>('/api/v1/document/document/idPicture').delete();
};

const deleteDocument = () => {
  return useApi<Response<string>>('/api/v1/document/document/document').delete();
};

export const apiFiles = {
  getImage,
  uploadDocument,
  uploadIdPicture,
  deleteIdPicture,
  deleteDocument,
};
