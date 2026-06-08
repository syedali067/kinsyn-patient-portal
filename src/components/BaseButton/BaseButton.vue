<script setup lang="ts">
import type {
  BaseButtonType,
  BaseButtonTarget,
  BaseButtonTheme,
  BaseButtonColor,
  BaseButtonSize,
} from './types';
import BaseSpinner from '@/components/BaseSpinner/BaseSpinner.vue';
import { useSlots, computed, type Slots } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

const props = withDefaults(
  defineProps<{
    type?: BaseButtonType;
    to?: RouteLocationRaw;
    href?: string;
    target?: BaseButtonTarget;
    disabled?: boolean;
    theme?: BaseButtonTheme;
    color?: BaseButtonColor;
    size?: BaseButtonSize;
    rounded?: boolean;
    span?: boolean;
    loading?: boolean;
    group?: boolean;
  }>(),
  {
    type: 'button',
    to: '',
    href: '',
    target: '_self',
    disabled: false,
    theme: 'solid',
    color: 'dark',
    size: '44',
    rounded: false,
    span: false,
    loading: false,
    group: false,
  },
);

const emit = defineEmits<{
  click: [value: Event];
}>();

const slots: Slots = useSlots();

const tag = computed(() => {
  if (props.span) return 'span';
  if (props.to) return 'RouterLink';
  if (props.href) return 'a';
  return 'button';
});

const attributes = computed(() => {
  if (props.span) return {};
  if (props.to) return { to: props.to, target: props.target };
  if (props.href) return { href: props.href, target: props.target };
  return { type: props.type, disabled: props.disabled };
});

const themeColorMap = {
  solid: {
    dark: 'bg-coal hover:bg-stone disabled:bg-disabled-bg text-white disabled:text-disabled-text focus-visible:outline-2 outline-beige -outline-offset-1',
    light:
      'bg-white hover:bg-stone disabled:bg-disabled-bg text-coal hover:text-white disabled:text-disabled-text focus-visible:outline-2 outline-beige -outline-offset-1',
    gray: 'bg-bone hover:bg-stone disabled:bg-disabled-bg text-coal hover:text-white disabled:text-disabled-text focus-visible:outline-2 outline-beige -outline-offset-1',
  },
  outline: {
    dark: 'border border-stone hover:border-coal disabled:border-stone text-coal disabled:text-disabled-text focus-visible:outline-2 outline-beige -outline-offset-1',
    light:
      'border border-white hover:border-stone disabled:border-stone text-white hover:text-stone disabled:text-disabled-text focus-visible:outline-2 outline-beige -outline-offset-1',
    contrast:
      'border border-white hover:border-coal disabled:border-stone text-white hover:text-coal disabled:text-disabled-text focus-visible:outline-2 outline-beige -outline-offset-1',
  },
  link: {
    dark: 'text-coal hover:text-secondary-text disabled:text-disabled-text underline underline-offset-[0.3em] focus-visible:decoration-beige outline-none',
    brand:
      'text-beige hover:text-sand disabled:text-disabled-text underline underline-offset-[0.3em] focus-visible:decoration-coal outline-none',
  },
} as Record<BaseButtonTheme, Record<BaseButtonColor, string>>;

const colorClass = computed(() => {
  return themeColorMap[props.theme]?.[props.color] || themeColorMap.solid.dark;
});

const groupHoverMap = {
  solid: {
    dark: 'group-hover:bg-stone',
    light: 'group-hover:bg-stone group-hover:text-white ',
    gray: 'group-hover:bg-stone group-hover:text-white',
  },
  outline: {
    dark: 'group-hover:border-coal',
    light: 'group-hover:border-stone group-hover:text-stone',
  },
  link: {
    dark: 'group-hover:text-secondary-text',
    brand: 'group-hover:text-sand',
  },
} as Record<BaseButtonTheme, Record<BaseButtonColor, string>>;

const groupClass = computed(() => {
  if (props.group) {
    return groupHoverMap[props.theme]?.[props.color];
  }
  return '';
});

const sizeClass = computed(() => {
  if (props.theme === 'link') {
    return {
      'text-10': ['32', '37', '40'].includes(props.size),
      'text-12': ['44', '48', '64'].includes(props.size),
    };
  }

  if (!slots.default) {
    return {
      'size-32': !slots.default && props.size === '32',
      'size-37': !slots.default && props.size === '37',
      'size-40': !slots.default && props.size === '40',
      'size-44': !slots.default && props.size === '44',
      'size-48': !slots.default && props.size === '48',
      'size-64': !slots.default && props.size === '64',
    };
  }

  return {
    'h-32 px-20 text-10': props.size === '32',
    'h-37 px-20 text-10': props.size === '37',
    'h-40 px-20 text-10': props.size === '40',
    'h-44 px-24 text-12': props.size === '44',
    'h-48 px-24 text-12': props.size === '48',
    'h-64 px-24 text-12': props.size === '64',
  };
});

const roundedClass = computed(() => ({
  'rounded-4': !props.rounded,
  'rounded-full': props.rounded,
}));

const onClick = (e: Event) => {
  if (props.loading || props.disabled) {
    e.preventDefault();
    return;
  }
  emit('click', e);
};
</script>

<template>
  <component
    :is="tag"
    v-bind="attributes"
    class="inline-block text-center font-medium uppercase transition-[color,background-color,border-color]"
    :class="[colorClass, sizeClass, roundedClass, groupClass]"
    @click="onClick"
  >
    <span class="relative flex h-full w-full items-center justify-center gap-8">
      <span
        v-if="$slots.prepend"
        class="shrink-0"
        :class="{
          'opacity-0': loading,
        }"
      >
        <slot name="prepend" />
      </span>

      <span
        v-if="$slots.default"
        :class="{
          'opacity-0': loading,
        }"
      >
        <slot />
      </span>

      <span
        v-if="$slots.append"
        class="shrink-0"
        :class="{
          'opacity-0': loading,
        }"
      >
        <slot name="append" />
      </span>

      <span
        v-if="loading"
        class="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <BaseSpinner class="size-20" />
      </span>
    </span>
  </component>
</template>
