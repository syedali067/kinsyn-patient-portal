<script setup lang="ts">
import clockAnimation from '@/assets/lottie/clock.json';
import lottie from 'lottie-web';
import { ref, onMounted } from 'vue';

const props = withDefaults(
  defineProps<{
    size?: string;
    loop?: boolean;
  }>(),
  {
    size: '24',
    loop: true,
  },
);

const container = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!container.value) return;
  lottie.loadAnimation({
    container: container.value,
    renderer: 'svg',
    loop: props.loop,
    autoplay: true,
    animationData: clockAnimation,
  });
});
</script>

<template>
  <div
    ref="container"
    class="inline-block"
    data-testpl="clock"
    :style="{ width: size + 'px', height: size + 'px' }"
  />
</template>
