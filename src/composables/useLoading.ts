import { onBeforeMount, ref } from 'vue';

export const useLoading = (requests: PromiseLike<unknown>[]) => {
  const loading = ref(false);

  onBeforeMount(async () => {
    try {
      loading.value = true;
      await Promise.all(requests);
    } finally {
      loading.value = false;
    }
  });

  return {
    loading,
  };
};
