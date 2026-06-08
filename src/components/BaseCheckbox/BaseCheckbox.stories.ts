import BaseCheckbox from './BaseCheckbox.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

const meta = {
  title: 'Base/BaseCheckbox',
  component: BaseCheckbox,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    size: { control: 'select', options: ['24'] },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
  },
  args: {
    value: '1',
    size: '24',
    disabled: false,
    error: '',
  },
} satisfies Meta<typeof BaseCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { BaseCheckbox },
    setup() {
      const modelValue = ref(false);
      return { args, modelValue };
    },
    template: `
      <div class="flex flex-col gap-12">
        <BaseCheckbox v-bind="args" v-model="modelValue">
          Checkbox label
        </BaseCheckbox>
        <div class="text-14 text-stone">Checked: {{ modelValue }}</div>
      </div>
    `,
  }),
};
