import BaseAvatar from './BaseAvatar.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Base/BaseAvatar',
  component: BaseAvatar,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    src: { control: 'text' },
    alt: { control: 'text' },
    size: { control: 'select', options: ['40', '64'] },
  },
  args: {
    name: '',
    src: '',
    alt: '',
    size: '40',
  },
} satisfies Meta<typeof BaseAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
