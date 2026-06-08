import BaseSelect from './BaseSelect.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Base/BaseSelect',
  component: BaseSelect,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    error: { control: 'text' },
    size: { control: 'select', options: ['48'] },
    by: { control: 'text' },
  },
  args: {
    placeholder: 'Placeholder',
    options: [
      { label: 'Item 1', value: 1 },
      { label: 'Item 2', value: 2 },
      { label: 'Item 3', value: 3 },
    ],
    disabled: false,
    loading: false,
    error: '',
    size: '48',
    by: 'value',
  },
} satisfies Meta<typeof BaseSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
  },
};
