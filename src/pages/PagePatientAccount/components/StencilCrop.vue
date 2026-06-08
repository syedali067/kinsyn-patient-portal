<script setup lang="ts">
import type { CropImage, CropTransitions } from '../types.ts';
import { computed } from 'vue';
import {
  DraggableArea,
  StencilPreview,
  ResizeEvent,
  DraggableElement,
  DragEvent,
} from 'vue-advanced-cropper';
import type { Coordinates } from 'vue-advanced-cropper';

const props = defineProps<{
  image: CropImage;
  coordinates: Coordinates;
  transitions?: CropTransitions;
  stencilCoordinates: Coordinates;
}>();

const emit = defineEmits(['move', 'move-end', 'resize', 'resize-end']);

const style = computed(() => {
  const { height, width, left, top } = props.stencilCoordinates || {};

  const style = {
    width: `${width}px`,
    height: `${height}px`,
    transform: `translate(${left}px, ${top}px)`,
    transition: '',
  };
  if (props.transitions && props.transitions.enabled) {
    style.transition = `${props.transitions.time}ms ${props.transitions.timingFunction}`;
  }
  return style;
});

const onMove = (moveEvent: MouseEvent) => {
  emit('move', moveEvent);
};
const onMoveEnd = () => {
  emit('move-end');
};
const onResize = (dragEvent: DragEvent) => {
  const shift = dragEvent.shift();

  const widthResize = shift.left;
  const heightResize = -shift.top;

  emit(
    'resize',
    new ResizeEvent(
      {
        left: widthResize,
        right: widthResize,
        top: heightResize,
        bottom: heightResize,
      },
      {
        compensate: true,
      },
    ),
  );
};
const onResizeEnd = () => {
  emit('resize-end');
};

const aspectRatios = () => {
  return {
    minimum: 1,
    maximum: 1,
  };
};

defineExpose({
  aspectRatios,
});
</script>

<template>
  <div class="absolute cursor-move rounded-full" :style="style">
    <draggable-element
      class="absolute top-[14%] right-[15%] z-1 flex h-30 w-30 translate-x-1/2 -translate-y-1/2 transform cursor-ne-resize items-center justify-center"
      @drag="onResize"
      @drag-end="onResizeEnd"
    >
      <svg
        class="circle-stencil__icon"
        xmlns="http://www.w3.org/2000/svg"
        width="26.7"
        height="26.3"
        @mousedown.prevent
      >
        <path
          fill="#FFF"
          d="M15.1 4.7L18.3 6l-3.2 3.3 2.3 2.3 3.3-3.3 1.3 3.3L26.7 0zM9.3 14.7L6 18l-1.3-3.3L0 26.3l11.6-4.7-3.3-1.3 3.3-3.3z"
        ></path>
      </svg>
    </draggable-element>
    <draggable-area @move="onMove" @move-end="onMoveEnd">
      <stencil-preview
        class="overflow-hidden rounded-full"
        :image
        :coordinates
        :width="stencilCoordinates?.width"
        :height="stencilCoordinates?.height"
        :transitions
      />
    </draggable-area>
  </div>
</template>
