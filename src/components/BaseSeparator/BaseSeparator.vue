<script setup lang="ts">
import { Separator } from 'reka-ui';

withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical';
    as?: string;
    decorative?: boolean;
  }>(),
  {
    orientation: 'horizontal',
    as: 'div',
    decorative: false,
  },
);
</script>

<template>
  <Separator
    class="data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"
    :orientation
    :as
    :decorative
  />
</template>
