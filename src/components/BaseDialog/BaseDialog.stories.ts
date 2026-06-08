import BaseDialog from './BaseDialog.vue';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

const meta = {
  title: 'Base/BaseDialog',
  component: BaseDialog,
  tags: ['autodocs'],
  argTypes: {
    position: { control: 'select', options: ['center', 'right', 'bottom'] },
    closeBtn: { control: 'boolean' },
  },
  args: {
    position: 'center',
    closeBtn: true,
  },
} satisfies Meta<typeof BaseDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    class: 'max-w-400',
  },
  render: (args) => ({
    components: { BaseButton, BaseDialog },
    setup() {
      const isOpen = ref(false);
      return { args, isOpen };
    },
    template: `
      <BaseButton @click="isOpen = true">Open</BaseButton>
      <BaseDialog v-bind="args" v-model:open="isOpen">
        <template #header>Header</template>
        <template #content>Content</template>
        <template #footer>Footer</template>
      </BaseDialog>
    `,
  }),
};
