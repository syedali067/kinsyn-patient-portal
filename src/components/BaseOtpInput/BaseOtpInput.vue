<script setup lang="ts">
import type { BaseOtpInputSize } from './types';
import { PinInputInput, PinInputRoot } from 'reka-ui';
import { computed, ref, type Ref } from 'vue';

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    size?: BaseOtpInputSize;
    disabled?: boolean;
    error?: string | Ref<string>;
    name?: string;
    length?: number;
  }>(),
  {
    placeholder: '○',
    size: '48',
    disabled: false,
    error: '',
    name: undefined,
    length: 5,
  },
);

const emit = defineEmits<{
  complete: [value: string];
  change: [value: string];
}>();

const sizeClass = computed(() => ({
  'h-48 min-w-48': props.size === '48',
}));

const focused = ref(Array.from({ length: props.length }).fill(false));

const valueModel = defineModel<string>({ default: '' });

const value = computed({
  get() {
    return valueModel.value.split('');
  },
  set(value) {
    valueModel.value = value.join('').toUpperCase();
    emit('change', valueModel.value);
  },
});

const onComplete = () => {
  emit('complete', valueModel.value);
};
</script>

<template>
  <div class="flex flex-col gap-8">
    <PinInputRoot
      class="flex items-center gap-8 lg:gap-12"
      v-model="value"
      otp
      :placeholder
      :disabled
      :name
      @complete="onComplete"
    >
      <PinInputInput
        v-for="(id, index) in length"
        :key="id"
        :index="index"
        class="rounded-4 text-14 text-coal cursor-text items-center px-16 text-center -outline-offset-1"
        :class="[
          sizeClass,
          {
            'border-error border': error,
            'border-ash border': !error,
            'outline-error outline-2': focused[index] && error,
            'outline-beige outline-2': focused[index] && !error,
            'bg-disabled-bg': disabled,
          },
        ]"
        @focus="focused[index] = true"
        @blur="focused[index] = false"
      />
    </PinInputRoot>

    <p v-if="error" class="text-error text-12">
      {{ error }}
    </p>
  </div>
</template>
