import BaseTabs from './BaseTabs.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Base/BaseTabs',
  component: BaseTabs,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: { control: 'text' },
    theme: { control: 'select', options: ['tab', 'underline', 'text', 'underline-text'] },
  },
} satisfies Meta<typeof BaseTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: '1',
    theme: 'underline',
    tabs: [
      { id: '1', label: 'Tab 1' },
      { id: '2', label: 'Tab 2' },
      { id: '3', label: 'Disabled Tab', disabled: true },
    ],
  },
};
