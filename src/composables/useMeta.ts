import { useTitle, useFavicon } from '@vueuse/core';

const title = useTitle();
const favicon = useFavicon();

export const useMeta = (props: { title?: string; favicon?: string }) => {
  title.value = props.title;
  favicon.value = props.favicon;

  return {
    title,
    favicon,
  };
};
