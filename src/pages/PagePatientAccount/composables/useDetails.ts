import { apiUser } from '@/api/user';
import { useToastStore } from '@/stores/toast';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';

export const useDetails = () => {
  const userStore = useUserStore();
  const toastStore = useToastStore();
  const uploadPhotoLoading = ref(false);

  const uploadPhoto = async (file: File) => {
    uploadPhotoLoading.value = true;

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await apiUser.uploadPhoto(formData);

      if (response.statusCode.value !== 200) {
        return;
      }

      toastStore.addToast({
        type: 'success',
        text: response.data.value?.message,
      });

      await userStore.getProfile(false);
      return response.data.value?.data;
    } finally {
      uploadPhotoLoading.value = false;
    }
  };

  return {
    uploadPhoto,
    uploadPhotoLoading,
  };
};
