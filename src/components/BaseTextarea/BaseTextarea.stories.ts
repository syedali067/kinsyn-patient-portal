import BaseTextarea from './BaseTextarea.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Base/BaseTextarea',
  component: BaseTextarea,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
    fieldClass: { control: 'text' },
    rows: { control: 'number' },
  },
  args: {
    placeholder: 'Placeholder',
    disabled: false,
    error: '',
    fieldClass: 'min-h-140',
    rows: 4,
  },
} satisfies Meta<typeof BaseTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    class: 'w-296',
  },
};
