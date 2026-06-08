import BaseCheckbox from './BaseCheckbox.vue';
import BaseCheckboxGroup from './BaseCheckboxGroup.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Base/BaseCheckboxGroup',
  component: BaseCheckboxGroup,
  tags: ['autodocs'],
  argTypes: {
    as: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    as: 'div',
    disabled: false,
  },
} satisfies Meta<typeof BaseCheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { BaseCheckboxGroup, BaseCheckbox },
    setup() {
      return { args };
    },
    data() {
      return {
        modelValue: ['1'],
      };
    },
    template: `
      <BaseCheckboxGroup v-bind="args" v-model="modelValue" class="grid gap-8">
        <BaseCheckbox value="1">
          Item 1
        </BaseCheckbox>
        <BaseCheckbox value="2">
          Item 2
        </BaseCheckbox>
        <BaseCheckbox value="3">
          Item 3
        </BaseCheckbox>
      </BaseCheckboxGroup>
    `,
  }),
};
