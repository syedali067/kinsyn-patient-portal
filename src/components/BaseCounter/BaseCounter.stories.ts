import BaseCounter from './BaseCounter.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Base/BaseCounter',
  component: BaseCounter,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'number' },
    size: { control: 'select', options: ['16', '24'] },
  },
  args: {
    modelValue: 3,
    size: '24',
  },
} satisfies Meta<typeof BaseCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
