import throttle from 'lodash/throttle';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';

/**
 * This composable is used to create a masonry grid layout.
 * It uses the ResizeObserver API to recalculate the grid layout when the window is resized.
 * It also uses the throttle function to prevent the recalculation from being called too often.
 */
export function useMasonryGrid(gridRef: Ref<HTMLElement | null>) {
  const rowGap = 24;
  const rowHeight = 1;

  const items = ref<HTMLElement[]>([]);
  const resizeObserver = ref<ResizeObserver | null>(null);
  const isStopped = ref(false);

  const start = () => {
    isStopped.value = false;

    // Recalculate items after every update or start
    items.value = Array.from(gridRef.value?.children || []) as HTMLElement[];

    items.value.forEach((item) => {
      item.style.gridRowEnd = '';
      const height = item.getBoundingClientRect().height;
      const span = Math.ceil((height + rowGap) / (rowHeight + rowGap));
      item.style.gridRowEnd = `span ${span}`;
    });

    if (gridRef.value && 'ResizeObserver' in window && !resizeObserver.value) {
      resizeObserver.value = new ResizeObserver(recalc);
      resizeObserver.value.observe(gridRef.value);
    }
  };

  const recalc = throttle(() => {
    if (isStopped.value) return;

    start();
  }, 100);

  function stop() {
    isStopped.value = true;

    items.value.forEach((item) => {
      item.style.gridRowEnd = '';
    });

    if (resizeObserver.value) {
      resizeObserver.value.disconnect();
      resizeObserver.value = null;
    }
  }

  onMounted(() => {
    start();
  });

  onUnmounted(() => {
    stop();
  });

  return { masonryStart: start, masonryStop: stop, masonryRecalc: recalc };
}
