import BaseCarousel from './BaseCarousel.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Base/BaseCarousel',
  component: BaseCarousel,
  tags: ['autodocs'],
  argTypes: {
    total: { control: 'number' },
    color: { control: 'select', options: ['light', 'dark'] },
  },
  args: {
    total: 5,
    color: 'light',
  },
} satisfies Meta<typeof BaseCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { BaseCarousel },
    setup() {
      return { args };
    },
    data() {
      return {
        page: 1,
      };
    },
    template: `
      <div class="flex flex-col items-center gap-12">
        <div>Page: {{ page }}</div>
        <BaseCarousel v-bind="args" v-model="page" />
      </div>
    `,
  }),
};
