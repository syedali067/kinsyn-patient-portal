import BaseRadio from './BaseRadio.vue';
import BaseRadioGroup from './BaseRadioGroup.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Base/BaseRadioGroup',
  component: BaseRadioGroup,
  tags: ['autodocs'],
  argTypes: {
    as: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    as: 'div',
    disabled: false,
  },
} satisfies Meta<typeof BaseRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { BaseRadioGroup, BaseRadio },
    setup() {
      return { args };
    },
    data() {
      return {
        modelValue: '1',
      };
    },
    template: `
      <BaseRadioGroup v-bind="args" v-model="modelValue" class="grid gap-8">
        <BaseRadio value="1">
          Item 1
        </BaseRadio>
        <BaseRadio value="2">
          Item 2
        </BaseRadio>
        <BaseRadio value="3">
          Item 3
        </BaseRadio>
      </BaseRadioGroup>
    `,
  }),
};
