import BaseSeparator from '@/components/BaseSeparator/BaseSeparator.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Base/BaseSeparator',
  component: BaseSeparator,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    as: { control: 'text' },
    decorative: { control: 'boolean' },
  },
  args: {
    orientation: 'horizontal',
    as: 'div',
    decorative: false,
    class: 'bg-black',
  },
} satisfies Meta<typeof BaseSeparator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { BaseSeparator },
    setup() {
      return { args };
    },
    template: `
      <div class="h-100">
        <BaseSeparator v-bind="args" />
      </div>
    `,
  }),
};
