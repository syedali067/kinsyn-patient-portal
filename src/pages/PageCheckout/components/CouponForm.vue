<script setup lang="ts">
import { useCouponForm } from '../composables/useCouponForm';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import { computed, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    value?: string;
    loading?: boolean;
  }>(),
  {
    value: '',
    loading: false,
  },
);

const emit = defineEmits<{
  add: [value: string];
  remove: [];
}>();

const error = defineModel<string | null>('error', { default: null });

const open = ref(!!props.value);
const { couponForm, couponValidation } = useCouponForm();
const hasCoupon = computed(() => !!props.value);

const add = async () => {
  error.value = null;

  if (!(await couponValidation.value.$validate())) {
    return;
  }
  emit('add', couponForm.value.coupon);
  couponValidation.value.$reset();
};
const remove = () => emit('remove');

watch(
  () => props.value,
  (value) => {
    couponForm.value.coupon = value ?? '';
  },
  { immediate: true },
);
</script>

<template>
  <div>
    <div class="flex items-center justify-between gap-12">
      <p class="text-14">{{ $t('applyADiscountCode') }}</p>

      <BaseButton
        v-if="!open"
        theme="link"
        color="brand"
        @click="open = true"
        data-testpl="coupon-form-open-button"
      >
        {{ $t('add') }}
      </BaseButton>
    </div>

    <form v-if="open" class="mt-16 flex gap-12" @submit.prevent="add" data-testpl="coupon-form">
      <BaseInput
        v-model.trim="couponForm.coupon"
        class="grow"
        :animated-placeholder="false"
        :disabled="hasCoupon"
        :error="error || couponValidation.coupon.$errors[0]?.$message"
        @input="error = null"
        autofocus
        data-testpl="coupon-form-input"
      />

      <BaseButton
        v-if="!hasCoupon"
        size="48"
        :loading
        type="submit"
        data-testpl="coupon-form-add-button"
      >
        {{ $t('add') }}
      </BaseButton>

      <BaseButton v-else size="48" :loading @click="remove" data-testpl="coupon-form-remove-button">
        {{ $t('remove') }}
      </BaseButton>
    </form>
  </div>
</template>
