import { apiZendesk } from '@/api/integrations/zendesk';
import { releaseFlags } from '@/config/releaseFlags';
import { useUserStore } from '@/stores/user';
import type { JwtCallback } from '@/types/zendesk';
import { createSharedComposable } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { onBeforeMount, ref, watch } from 'vue';

const useSharedRefs = createSharedComposable(() => {
  const isZendeskInited = ref(false);
  const isZendeskLoaded = ref(false);
  const isZendeskLoggedIn = ref(false);

  return {
    isZendeskInited,
    isZendeskLoaded,
    isZendeskLoggedIn,
  };
});

export const useZendesk = () => {
  const { isZendeskInited, isZendeskLoaded, isZendeskLoggedIn } = useSharedRefs();
  const userStore = useUserStore();
  const { isLoggedIn: isPortalUserLoggedIn } = storeToRefs(userStore);

  const loadZendeskScript = async () => {
    if (document.getElementById('ze-snippet')) {
      isZendeskLoaded.value = true;
      return Promise.resolve(true);
    }

    return new Promise<boolean>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://static.zdassets.com/ekr/snippet.js?key=${import.meta.env.VITE_ZENDESK_KEY}`;
      script.id = 'ze-snippet';
      script.onload = () => {
        if (window.zE) {
          isZendeskLoaded.value = true;
          resolve(true);
        } else {
          reject(false);
        }
      };
      script.onerror = () => {
        reject(false);
      };
      document.head.appendChild(script);
    });
  };

  const unloadZendeskScript = async () => {
    return new Promise((resolve, reject) => {
      const script = document.getElementById('ze-snippet');

      if (script) {
        script.remove();
        resolve(true);
      } else {
        reject(false);
      }
    });
  };

  const showZendesk = () => {
    window.zE?.('messenger', 'show');
  };

  const hideZendesk = () => {
    window.zE?.('messenger', 'hide');
  };

  const jwtCallback: JwtCallback = async (callback) => {
    const response = await apiZendesk.getToken();
    const token = response.data.value?.data.token;

    if (token) {
      callback(token);
    }
  };

  const loginZendesk = () => {
    if (!window.zE || isZendeskLoggedIn.value) {
      return;
    }

    window.zE('messenger', 'loginUser', jwtCallback, (error) => {
      if (error) {
        console.error(error);
        return;
      }

      isZendeskLoggedIn.value = true;
    });
  };

  const logoutZendesk = () => {
    if (!window.zE || !isZendeskLoggedIn.value) {
      return;
    }

    window.zE('messenger', 'logoutUser');
    isZendeskLoggedIn.value = false;
  };

  const init = async () => {
    if (!releaseFlags.zendeskEnabled) {
      return Promise.resolve();
    }

    if (isZendeskInited.value) {
      return Promise.resolve();
    }

    await loadZendeskScript();

    if (releaseFlags.zendeskHiddenByDefault) {
      hideZendesk();
    }

    isZendeskInited.value = true;
  };

  watch(
    [isZendeskInited, isPortalUserLoggedIn],
    () => {
      if (isZendeskInited.value) {
        if (isPortalUserLoggedIn.value) {
          loginZendesk();
        } else {
          logoutZendesk();
        }
      }
    },
    { immediate: true },
  );

  onBeforeMount(() => {
    init();
  });

  return {
    unloadZendeskScript,
    showZendesk,
    hideZendesk,
    isZendeskInited,
    isZendeskLoggedIn,
    loginZendesk,
    logoutZendesk,
  };
};
