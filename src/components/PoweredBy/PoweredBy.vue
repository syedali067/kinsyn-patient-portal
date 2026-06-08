<script setup lang="ts">
import AICompanionModal from './AICompanionModal.vue';
import IconAI from '@/assets/icons/ai.svg?component';
import { ref } from 'vue';

const isOpen = ref(false);
</script>

<template>
  <div class="flex items-center gap-4" :class="$attrs.class">
    <IconAI class="text-beige" />
    <p class="text-12">
      {{ $t('poweredBy') }}
      <button type="button" class="text-link-text font-medium underline" @click="isOpen = true">
        {{ $t('kinsynAiCompanion') }}
      </button>
    </p>
  </div>

  <AICompanionModal v-model="isOpen" />
</template>
