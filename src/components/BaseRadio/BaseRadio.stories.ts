import BaseRadio from './BaseRadio.vue';
import BaseRadioGroup from './BaseRadioGroup.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Base/BaseRadio',
  component: BaseRadio,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['24'] },
    disabled: { control: 'boolean' },
  },
  args: {
    size: '24',
    disabled: false,
  },
} satisfies Meta<typeof BaseRadio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { BaseRadio, BaseRadioGroup },
    setup() {
      return { args };
    },
    template: `
      <BaseRadioGroup class="grid gap-8">
        <BaseRadio v-bind="args" value="1">
          Item 1
        </BaseRadio>
        <BaseRadio v-bind="args" value="2">
          Item 2
        </BaseRadio>
      </BaseRadioGroup>
    `,
  }),
};
