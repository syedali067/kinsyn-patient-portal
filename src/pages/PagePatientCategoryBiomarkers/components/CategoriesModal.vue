<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';
import type { BiomarkersCategory } from '@/types/health.ts';

const isOpen = defineModel<boolean>('open', { default: false });

const emit = defineEmits<{
  close: [];
}>();

defineProps<{
  categorySlug: string;
  categories: BiomarkersCategory[];
}>();

const closeModal = () => {
  isOpen.value = false;
  emit('close');
};
</script>

<template>
  <BaseDialog v-model:open="isOpen" position="bottom">
    <template #header>
      <h1 class="pl-8">
        {{ $t('categories') }} <span v-if="categories.length">({{ categories.length }})</span>
      </h1>
      <div class="bg-ash absolute top-8 left-1/2 h-3 w-48 -translate-x-1/2" />
      <div class="bg-bone absolute bottom-0 left-0 h-1 w-full" />
    </template>

    <template #content>
      <ul class="space-y-8 py-12">
        <li v-for="category in categories" :key="category.slug" class="-ml-4">
          <RouterLink
            :to="{
              name: 'PatientCategoryBiomarkers',
              params: { categorySlug: category.slug },
            }"
            type="button"
            class="rounded-4 hover:bg-bone/50 flex h-38 w-full items-center px-12 py-10 text-left"
            :class="{
              'bg-bone/50 font-medium': categorySlug === category.slug,
            }"
            @click="closeModal"
          >
            <span>
              {{ category.name }}
              <sup class="text-12 text-disabled-text align-start ml-2">{{
                category.data.length
              }}</sup>
            </span>
          </RouterLink>
        </li>
      </ul>
    </template>
  </BaseDialog>
</template>
