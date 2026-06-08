import BaseCalendar from './BaseCalendar.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Base/BaseCalendar',
  component: BaseCalendar,
  tags: ['autodocs'],
} satisfies Meta<typeof BaseCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
