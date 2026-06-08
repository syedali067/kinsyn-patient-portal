<script setup lang="ts">
import type { BaseAvatarSize } from './types';
import IconK from '@/assets/icons/k.svg?component';
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui';
import { computed, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    name?: string | null;
    src?: string | null;
    alt?: string | null;
    size?: BaseAvatarSize;
  }>(),
  {
    name: '',
    src: '',
    alt: '',
    size: '40',
  },
);

const currentSrc = ref(props.src);
const isError = ref(false);

const initials = computed(() => {
  if (!props.name?.trim()) return null;
  return props.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .trim();
});

const sizeClass = computed(() => ({
  'size-40': props.size === '40',
  'size-64': props.size === '64',
}));

const loadImage = async (src: string | null) => {
  if (!src) {
    currentSrc.value = null;
    return;
  }

  isError.value = false;

  try {
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
      img.onerror = () => reject();
    });
    currentSrc.value = src;
  } catch {
    isError.value = true;
    currentSrc.value = null;
  }
};

watch(
  () => props.src,
  (newSrc) => loadImage(newSrc),
  { immediate: true },
);
</script>

<template>
  <AvatarRoot
    class="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full align-middle select-none"
    :class="sizeClass"
    data-testpl="base-avatar-root"
  >
    <AvatarImage
      v-if="currentSrc && !isError"
      class="size-full object-cover"
      :src="currentSrc"
      :alt="alt"
      data-testpl="base-avatar-image"
    />

    <AvatarFallback
      class="text-coal border-stone flex size-full items-center justify-center rounded-full border-2"
      data-testpl="base-avatar-fallback"
    >
      <template v-if="initials">
        {{ initials }}
      </template>
      <IconK v-else class="size-14" />
    </AvatarFallback>
  </AvatarRoot>
</template>
