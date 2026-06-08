import BaseTicker from '@/components/BaseTicker/BaseTicker.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Base/BaseTicker',
  component: BaseTicker,
  tags: ['autodocs'],
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: {},
} satisfies Meta<typeof BaseTicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithNegativeValues: Story = {
  args: {
    min: -100,
    max: 100,
  },
};

export const DisabledState: Story = {
  args: {
    disabled: true,
  },
};

export const LoadingState: Story = {
  args: {
    loading: true,
  },
};
