import type { RedirectToastOption } from '@/pages/PageRedirectToast/types.ts';
import { useToastStore } from '@/stores/toast';
import { useRoute, useRouter } from 'vue-router';

export function useRedirectToast() {
  const route = useRoute();
  const router = useRouter();
  const toastStore = useToastStore();

  const redirectToast = (
    optionsByType: Record<string, RedirectToastOption>,
    defaultRoute = 'PatientHealth',
  ) => {
    const type = route.params.type;
    const params = optionsByType[type as keyof typeof optionsByType];

    if (params) {
      toastStore.addToast({ type: params.type, text: params.message });
    }

    router.replace({ name: params?.route || defaultRoute });
  };

  return { redirectToast };
}
