import { apiFiles } from '@/api/files';
import { useToastStore } from '@/stores/toast';
import { useUserStore } from '@/stores/user';
import type { FileType } from '@/types/document.ts';

export const useIdentification = () => {
  const userStore = useUserStore();
  const toastStore = useToastStore();

  const uploadMethods = {
    idPicture: apiFiles.uploadIdPicture,
    document: apiFiles.uploadDocument,
  };

  const deleteMethods = {
    idPicture: apiFiles.deleteIdPicture,
    document: apiFiles.deleteDocument,
  };

  const uploadDocument = async (type: FileType, file: File) => {
    const formData = new FormData();
    formData.append(type, file);

    const response = await uploadMethods[type](formData);

    if (response.statusCode.value !== 200) {
      return null;
    }

    toastStore.addToast({
      type: 'success',
      text: response.data.value?.message,
    });

    await userStore.getProfile(false);
    return response.data.value?.data ?? null;
  };

  const deleteDocument = async (type: FileType) => {
    const response = await deleteMethods[type]();

    if (response.statusCode.value !== 200) {
      return null;
    }

    toastStore.addToast({
      type: 'success',
      text: response.data.value?.message,
    });

    await userStore.getProfile(false);
    return response.data.value?.data ?? null;
  };

  return {
    uploadMethods,
    deleteMethods,
    uploadDocument,
    deleteDocument,
  };
};
