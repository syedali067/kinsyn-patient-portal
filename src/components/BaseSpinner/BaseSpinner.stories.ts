import BaseSpinner from './BaseSpinner.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Base/BaseSpinner',
  component: BaseSpinner,
  tags: ['autodocs'],
} satisfies Meta<typeof BaseSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
