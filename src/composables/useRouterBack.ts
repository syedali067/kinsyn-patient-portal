import { useRouter } from 'vue-router';

export const useRouterBack = () => {
  const router = useRouter();

  const goBack = () => {
    if (!router.options.history.state.back) {
      router.push('/');
      return;
    }

    router.back();
  };

  return {
    goBack,
  };
};
