import { type Ref, watch } from 'vue';

/**
 * Awaits for a flag to be false.
 * Used to wait for a flag to be false before proceeding.
 *
 * @param flag - The flag to await.
 * @returns A promise that resolves when the flag is false.
 */
export const awaiter = async (flag: Ref<boolean>) => {
  await new Promise<void>((resolve) => {
    const stop = watch(
      flag,
      (val) => {
        if (!val) {
          stop();
          resolve();
        }
      },
      { immediate: false },
    );
  });
};
